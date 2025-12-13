import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { addGradeApi, deleteGradeApi, getGradesByDisciplineApi } from '@/api/gradesApi';
import type GradeInterface from '@/types/GradeInterface';

interface GradesHookInterface {
  grades: GradeInterface[];
  deleteGradeMutate: (_id: number) => void;
  addGradeMutate: (_gradeData: GradeInterface) => void;
  refetch: () => void;
}

const useGrades = (disciplineId: number | null): GradesHookInterface => {
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ['grades', disciplineId],
    queryFn: () => disciplineId ? getGradesByDisciplineApi(disciplineId) : Promise.resolve([]),
    enabled: !!disciplineId,
  });

  /**
   * Мутация удаления оценки
   */
  const deleteGradeMutate = useMutation({
    mutationFn: async (id: number) => deleteGradeApi(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['grades', disciplineId] });
      const previousGrades = queryClient.getQueryData<GradeInterface[]>(['grades', disciplineId]);
      let updatedGrades = [...(previousGrades ?? [])];

      if (!updatedGrades) return;

      updatedGrades = updatedGrades.map((grade: GradeInterface) => ({
        ...grade,
        ...(grade.id === id ? { isDeleted: true } : {}),
      }));
      queryClient.setQueryData<GradeInterface[]>(['grades', disciplineId], updatedGrades);

      console.log('deleteGradeMutate onMutate', previousGrades, updatedGrades);
      debugger;

      return { previousGrades, updatedGrades };
    },
    onError: (err, _variables, context) => {
      console.log('deleteGradeMutate  err', err);
      debugger;
      queryClient.setQueryData<GradeInterface[]>(['grades', disciplineId], context?.previousGrades);
    },
    onSuccess: async (_result, id, context) => {
      console.log('deleteGradeMutate  onSuccess', id);
      debugger;

      await queryClient.cancelQueries({ queryKey: ['grades', disciplineId] });
      if (!context?.previousGrades) {
        return;
      }
      const updatedGrades = context.previousGrades.filter((grade: GradeInterface) => grade.id !== id);
      queryClient.setQueryData<GradeInterface[]>(['grades', disciplineId], updatedGrades);
    },
  });

  const addGradeMutate = useMutation({
    mutationFn: async (gradeData: GradeInterface) => addGradeApi(gradeData),

    onMutate: async (gradeData: GradeInterface) => {
      const gradeDisciplineId = gradeData.disciplineId;
      await queryClient.cancelQueries({ queryKey: ['grades', gradeDisciplineId] });
      const previousGrades = queryClient.getQueryData<GradeInterface[]>(['grades', gradeDisciplineId]);
      const updatedGrades = [...(previousGrades ?? [])];

      if (!updatedGrades) return;

      updatedGrades.push({
        ...gradeData,
        isNew: true,
      });
      queryClient.setQueryData<GradeInterface[]>(['grades', gradeDisciplineId], updatedGrades);

      console.log('addGradeMutate onMutate', previousGrades, updatedGrades);
      debugger;

      return { previousGrades, updatedGrades, disciplineId: gradeDisciplineId };
    },
    onError: (_err, _variables, context) => {
      console.log('addGradeMutate  err', _err);
      debugger;

      if (context?.disciplineId) {
        queryClient.setQueryData<GradeInterface[]>(['grades', context.disciplineId], context?.previousGrades);
      }
    },
    onSuccess: async (newGrade, variables) => {
      console.log('addGradeMutate  onSuccess');
      debugger;
      // Инвалидируем кэш для дисциплины, к которой относится оценка
      await queryClient.invalidateQueries({ queryKey: ['grades', variables.disciplineId] });
    },
  });

  return {
    grades: data ?? [],
    deleteGradeMutate: deleteGradeMutate.mutate,
    addGradeMutate: addGradeMutate.mutate,
    refetch,
  };
};

export default useGrades;
