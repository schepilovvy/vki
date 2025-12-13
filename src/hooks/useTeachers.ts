import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { addTeacherApi, deleteTeacherApi, getTeachersApi } from '@/api/teachersApi';
import type TeacherInterface from '@/types/TeacherInterface';

interface TeachersHookInterface {
  teachers: TeacherInterface[];
  deleteTeacherMutate: (_teacherId: number) => void;
  addTeacherMutate: (_teacherData: TeacherInterface) => void;
}

const useTeachers = (): TeachersHookInterface => {
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => getTeachersApi(),
  });

  /**
   * Мутация удаления преподавателя
   */
  const deleteTeacherMutate = useMutation({
    mutationFn: async (teacherId: number) => deleteTeacherApi(teacherId),
    onMutate: async (teacherId: number) => {
      await queryClient.cancelQueries({ queryKey: ['teachers'] });
      const previousTeachers = queryClient.getQueryData<TeacherInterface[]>(['teachers']);
      let updatedTeachers = [...(previousTeachers ?? [])];

      if (!updatedTeachers) return;

      updatedTeachers = updatedTeachers.map((teacher: TeacherInterface) => ({
        ...teacher,
        ...(teacher.id === teacherId ? { isDeleted: true } : {}),
      }));
      queryClient.setQueryData<TeacherInterface[]>(['teachers'], updatedTeachers);

      console.log('deleteTeacherMutate onMutate', previousTeachers, updatedTeachers);
      debugger;

      return { previousTeachers, updatedTeachers };
    },
    onError: (err, variables, context) => {
      console.log('deleteTeacherMutate  err', err);
      debugger;
      queryClient.setQueryData<TeacherInterface[]>(['teachers'], context?.previousTeachers);
    },
    onSuccess: async (_result, teacherId, context) => {
      console.log('deleteTeacherMutate  onSuccess', teacherId);
      debugger;

      await queryClient.cancelQueries({ queryKey: ['teachers'] });
      if (!context?.previousTeachers) {
        return;
      }
      const updatedTeachers = context.previousTeachers.filter((teacher: TeacherInterface) => teacher.id !== teacherId);
      queryClient.setQueryData<TeacherInterface[]>(['teachers'], updatedTeachers);
    },
  });

  const addTeacherMutate = useMutation({
    mutationFn: async (teacherData: TeacherInterface) => addTeacherApi(teacherData),

    onMutate: async (teacherData: TeacherInterface) => {
      await queryClient.cancelQueries({ queryKey: ['teachers'] });
      const previousTeachers = queryClient.getQueryData<TeacherInterface[]>(['teachers']);
      const updatedTeachers = [...(previousTeachers ?? [])];

      if (!updatedTeachers) return;

      updatedTeachers.push({
        ...teacherData,
        isNew: true,
      });
      queryClient.setQueryData<TeacherInterface[]>(['teachers'], updatedTeachers);

      console.log('addTeacherMutate onMutate', previousTeachers, updatedTeachers);
      debugger;

      return { previousTeachers, updatedTeachers };
    },
    onError: (err, _variables, context) => {
      console.log('addTeacherMutate  err', err);
      debugger;

      queryClient.setQueryData<TeacherInterface[]>(['teachers'], context?.previousTeachers);
    },
    onSuccess: async () => {
      console.log('addTeacherMutate  onSuccess');
      debugger;
      refetch();
    },
  });

  return {
    teachers: data ?? [],
    deleteTeacherMutate: deleteTeacherMutate.mutate,
    addTeacherMutate: addTeacherMutate.mutate,
  };
};

export default useTeachers;
