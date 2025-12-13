import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { addGradeApi, deleteGradeApi, getGradesByDisciplineApi } from '@/api/gradesApi';
import type GradeInterface from '@/types/GradeInterface';

interface GradesHookInterface {
  grades: GradeInterface[];
  deleteGradeMutate: (gradeId: number) => void;
  addGradeMutate: (grade: GradeInterface) => void;
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
    mutationFn: async (gradeId: number) => deleteGradeApi(gradeId),
    onMutate: async (gradeId: number) => {
      await queryClient.cancelQueries({ queryKey: ['grades', disciplineId] });
      const previousGrades = queryClient.getQueryData<GradeInterface[]>(['grades', disciplineId]);
      let updatedGrades = [...(previousGrades ?? [])];

      if (!updatedGrades) return;

      updatedGrades = updatedGrades.map((grade: GradeInterface) => ({
        ...grade,
        ...(grade.id === gradeId ? { isDeleted: true } : {}),
      }));
      queryClient.setQueryData<GradeInterface[]>(['grades', disciplineId], updatedGrades);

      console.log('deleteGradeMutate onMutate', previousGrades, updatedGrades);
      debugger;

      return { previousGrades, updatedGrades };
    },
    onError: (err, variables, context) => {
      console.log('deleteGradeMutate  err', err);
      debugger;
      queryClient.setQueryData<GradeInterface[]>(['grades', disciplineId], context?.previousGrades);
    },
    onSuccess: async (gradeId, variables, { previousGrades }) => {
      console.log('deleteGradeMutate  onSuccess', gradeId);
      debugger;

      await queryClient.cancelQueries({ queryKey: ['grades', disciplineId] });
      if (!previousGrades) {
        return;
      }
      const updatedGrades = previousGrades.filter((grade: GradeInterface) => grade.id !== gradeId);
      queryClient.setQueryData<GradeInterface[]>(['grades', disciplineId], updatedGrades);
    },
  });

  const addGradeMutate = useMutation({
    mutationFn: async (grade: GradeInterface) => addGradeApi(grade),

    onMutate: async (grade: GradeInterface) => {
      const gradeDisciplineId = grade.disciplineId;
      await queryClient.cancelQueries({ queryKey: ['grades', gradeDisciplineId] });
      const previousGrades = queryClient.getQueryData<GradeInterface[]>(['grades', gradeDisciplineId]);
      const updatedGrades = [...(previousGrades ?? [])];

      if (!updatedGrades) return;

      updatedGrades.push({
        ...grade,
        isNew: true,
      });
      queryClient.setQueryData<GradeInterface[]>(['grades', gradeDisciplineId], updatedGrades);

      console.log('addGradeMutate onMutate', previousGrades, updatedGrades);
      debugger;

      return { previousGrades, updatedGrades, disciplineId: gradeDisciplineId };
    },
    onError: (err, variables, context) => {
      console.log('addGradeMutate  err', err);
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
