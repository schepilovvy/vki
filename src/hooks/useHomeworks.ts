import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { addHomeworkApi, deleteHomeworkApi, getHomeworksByDisciplineApi } from '@/api/homeworksApi';
import type HomeworkInterface from '@/types/HomeworkInterface';

interface HomeworksHookInterface {
  homeworks: HomeworkInterface[];
  deleteHomeworkMutate: (_id: number) => void;
  addHomeworkMutate: (_homeworkData: HomeworkInterface) => void;
  refetch: () => void;
}

const useHomeworks = (disciplineId: number | null): HomeworksHookInterface => {
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ['homeworks', disciplineId],
    queryFn: () => disciplineId ? getHomeworksByDisciplineApi(disciplineId) : Promise.resolve([]),
    enabled: !!disciplineId,
  });

  /**
   * Мутация удаления домашнего задания
   */
  const deleteHomeworkMutate = useMutation({
    mutationFn: async (id: number) => deleteHomeworkApi(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['homeworks', disciplineId] });
      const previousHomeworks = queryClient.getQueryData<HomeworkInterface[]>(['homeworks', disciplineId]);
      let updatedHomeworks = [...(previousHomeworks ?? [])];

      if (!updatedHomeworks) return;

      updatedHomeworks = updatedHomeworks.map((homework: HomeworkInterface) => ({
        ...homework,
        ...(homework.id === id ? { isDeleted: true } : {}),
      }));
      queryClient.setQueryData<HomeworkInterface[]>(['homeworks', disciplineId], updatedHomeworks);

      console.log('deleteHomeworkMutate onMutate', previousHomeworks, updatedHomeworks);
      debugger;

      return { previousHomeworks, updatedHomeworks };
    },
    onError: (err, _variables, context) => {
      console.log('deleteHomeworkMutate  err', err);
      debugger;
      queryClient.setQueryData<HomeworkInterface[]>(['homeworks', disciplineId], context?.previousHomeworks);
    },
    onSuccess: async (_result, id, context) => {
      console.log('deleteHomeworkMutate  onSuccess', id);
      debugger;

      await queryClient.cancelQueries({ queryKey: ['homeworks', disciplineId] });
      if (!context?.previousHomeworks) {
        return;
      }
      const updatedHomeworks = context.previousHomeworks.filter((homework: HomeworkInterface) => homework.id !== id);
      queryClient.setQueryData<HomeworkInterface[]>(['homeworks', disciplineId], updatedHomeworks);
    },
  });

  const addHomeworkMutate = useMutation({
    mutationFn: async (homeworkData: HomeworkInterface) => addHomeworkApi(homeworkData),

    onMutate: async (homeworkData: HomeworkInterface) => {
      const homeworkDisciplineId = homeworkData.disciplineId;
      await queryClient.cancelQueries({ queryKey: ['homeworks', homeworkDisciplineId] });
      const previousHomeworks = queryClient.getQueryData<HomeworkInterface[]>(['homeworks', homeworkDisciplineId]);
      const updatedHomeworks = [...(previousHomeworks ?? [])];

      if (!updatedHomeworks) return;

      updatedHomeworks.push({
        ...homeworkData,
        isNew: true,
      });
      queryClient.setQueryData<HomeworkInterface[]>(['homeworks', homeworkDisciplineId], updatedHomeworks);

      console.log('addHomeworkMutate onMutate', previousHomeworks, updatedHomeworks);
      debugger;

      return { previousHomeworks, updatedHomeworks, disciplineId: homeworkDisciplineId };
    },
    onError: (_err, _variables, context) => {
      console.log('addHomeworkMutate  err', _err);
      debugger;

      if (context?.disciplineId) {
        queryClient.setQueryData<HomeworkInterface[]>(['homeworks', context.disciplineId], context?.previousHomeworks);
      }
    },
    onSuccess: async (newHomework, variables) => {
      console.log('addHomeworkMutate  onSuccess');
      debugger;
      // Инвалидируем кэш для дисциплины, к которой относится домашнее задание
      await queryClient.invalidateQueries({ queryKey: ['homeworks', variables.disciplineId] });
    },
  });

  return {
    homeworks: data ?? [],
    deleteHomeworkMutate: deleteHomeworkMutate.mutate,
    addHomeworkMutate: addHomeworkMutate.mutate,
    refetch,
  };
};

export default useHomeworks;
