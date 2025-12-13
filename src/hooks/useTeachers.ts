import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { addTeacherApi, deleteTeacherApi, getTeachersApi } from '@/api/teachersApi';
import type TeacherInterface from '@/types/TeacherInterface';

interface TeachersHookInterface {
  teachers: TeacherInterface[];
  deleteTeacherMutate: (id: number) => void;
  addTeacherMutate: (data: TeacherInterface) => void;
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
    onSuccess: async (teacherId, variables, { previousTeachers }) => {
      console.log('deleteTeacherMutate  onSuccess', teacherId);
      debugger;

      await queryClient.cancelQueries({ queryKey: ['teachers'] });
      if (!previousTeachers) {
        return;
      }
      const updatedTeachers = previousTeachers.filter((teacher: TeacherInterface) => teacher.id !== teacherId);
      queryClient.setQueryData<TeacherInterface[]>(['teachers'], updatedTeachers);
    },
  });

  const addTeacherMutate = useMutation({
    mutationFn: async (teacher: TeacherInterface) => addTeacherApi(teacher),

    onMutate: async (teacher: TeacherInterface) => {
      await queryClient.cancelQueries({ queryKey: ['teachers'] });
      const previousTeachers = queryClient.getQueryData<TeacherInterface[]>(['teachers']);
      const updatedTeachers = [...(previousTeachers ?? [])];

      if (!updatedTeachers) return;

      updatedTeachers.push({
        ...teacher,
        isNew: true,
      });
      queryClient.setQueryData<TeacherInterface[]>(['teachers'], updatedTeachers);

      console.log('addTeacherMutate onMutate', previousTeachers, updatedTeachers);
      debugger;

      return { previousTeachers, updatedTeachers };
    },
    onError: (err, variables, context) => {
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
