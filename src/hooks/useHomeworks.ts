import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { addHomeworkApi, deleteHomeworkApi, getHomeworksByDisciplineApi } from '@/api/homeworksApi';
import type HomeworkInterface from '@/types/HomeworkInterface';

interface HomeworksHookInterface {
  homeworks: HomeworkInterface[];
  deleteHomeworkMutate: (homeworkId: number) => void;
  addHomeworkMutate: (homework: HomeworkInterface) => void;
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
    mutationFn: async (homeworkId: number) => deleteHomeworkApi(homeworkId),
    onMutate: async (homeworkId: number) => {
      await queryClient.cancelQueries({ queryKey: ['homeworks', disciplineId] });
      const previousHomeworks = queryClient.getQueryData<HomeworkInterface[]>(['homeworks', disciplineId]);
      let updatedHomeworks = [...(previousHomeworks ?? [])];

      if (!updatedHomeworks) return;

      updatedHomeworks = updatedHomeworks.map((homework: HomeworkInterface) => ({
        ...homework,
        ...(homework.id === homeworkId ? { isDeleted: true } : {}),
      }));
      queryClient.setQueryData<HomeworkInterface[]>(['homeworks', disciplineId], updatedHomeworks);

      console.log('deleteHomeworkMutate onMutate', previousHomeworks, updatedHomeworks);
      debugger;

      return { previousHomeworks, updatedHomeworks };
    },
    onError: (err, variables, context) => {
      console.log('deleteHomeworkMutate  err', err);
      debugger;
      queryClient.setQueryData<HomeworkInterface[]>(['homeworks', disciplineId], context?.previousHomeworks);
    },
    onSuccess: async (homeworkId, variables, { previousHomeworks }) => {
      console.log('deleteHomeworkMutate  onSuccess', homeworkId);
      debugger;

      await queryClient.cancelQueries({ queryKey: ['homeworks', disciplineId] });
      if (!previousHomeworks) {
        return;
      }
      const updatedHomeworks = previousHomeworks.filter((homework: HomeworkInterface) => homework.id !== homeworkId);
      queryClient.setQueryData<HomeworkInterface[]>(['homeworks', disciplineId], updatedHomeworks);
    },
  });

  const addHomeworkMutate = useMutation({
    mutationFn: async (homework: HomeworkInterface) => addHomeworkApi(homework),

    onMutate: async (homework: HomeworkInterface) => {
      const homeworkDisciplineId = homework.disciplineId;
      await queryClient.cancelQueries({ queryKey: ['homeworks', homeworkDisciplineId] });
      const previousHomeworks = queryClient.getQueryData<HomeworkInterface[]>(['homeworks', homeworkDisciplineId]);
      const updatedHomeworks = [...(previousHomeworks ?? [])];

      if (!updatedHomeworks) return;

      updatedHomeworks.push({
        ...homework,
        isNew: true,
      });
      queryClient.setQueryData<HomeworkInterface[]>(['homeworks', homeworkDisciplineId], updatedHomeworks);

      console.log('addHomeworkMutate onMutate', previousHomeworks, updatedHomeworks);
      debugger;

      return { previousHomeworks, updatedHomeworks, disciplineId: homeworkDisciplineId };
    },
    onError: (err, variables, context) => {
      console.log('addHomeworkMutate  err', err);
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
