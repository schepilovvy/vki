import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { addDisciplineApi, deleteDisciplineApi, getDisciplinesApi } from '@/api/disciplinesApi';
import type DisciplineInterface from '@/types/DisciplineInterface';

interface DisciplinesHookInterface {
  disciplines: DisciplineInterface[];
  deleteDisciplineMutate: (_id: number) => void;
  addDisciplineMutate: (_disciplineData: DisciplineInterface) => void;
}

const useDisciplines = (): DisciplinesHookInterface => {
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ['disciplines'],
    queryFn: () => getDisciplinesApi(),
  });

  /**
   * Мутация удаления дисциплины
   */
  const deleteDisciplineMutate = useMutation({
    mutationFn: async (id: number) => deleteDisciplineApi(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['disciplines'] });
      const previousDisciplines = queryClient.getQueryData<DisciplineInterface[]>(['disciplines']);
      let updatedDisciplines = [...(previousDisciplines ?? [])];

      if (!updatedDisciplines) return;

      updatedDisciplines = updatedDisciplines.map((discipline: DisciplineInterface) => ({
        ...discipline,
        ...(discipline.id === id ? { isDeleted: true } : {}),
      }));
      queryClient.setQueryData<DisciplineInterface[]>(['disciplines'], updatedDisciplines);

      console.log('deleteDisciplineMutate onMutate', previousDisciplines, updatedDisciplines);
      debugger;

      return { previousDisciplines, updatedDisciplines };
    },
    onError: (err, _variables, context) => {
      console.log('deleteDisciplineMutate  err', err);
      debugger;
      queryClient.setQueryData<DisciplineInterface[]>(['disciplines'], context?.previousDisciplines);
    },
    onSuccess: async (_result, id, context) => {
      console.log('deleteDisciplineMutate  onSuccess', id);
      debugger;

      await queryClient.cancelQueries({ queryKey: ['disciplines'] });
      if (!context?.previousDisciplines) {
        return;
      }
      const updatedDisciplines = context.previousDisciplines.filter((discipline: DisciplineInterface) => discipline.id !== id);
      queryClient.setQueryData<DisciplineInterface[]>(['disciplines'], updatedDisciplines);
    },
  });

  const addDisciplineMutate = useMutation({
    mutationFn: async (disciplineData: DisciplineInterface) => addDisciplineApi(disciplineData),

    onMutate: async (disciplineData: DisciplineInterface) => {
      await queryClient.cancelQueries({ queryKey: ['disciplines'] });
      const previousDisciplines = queryClient.getQueryData<DisciplineInterface[]>(['disciplines']);
      const updatedDisciplines = [...(previousDisciplines ?? [])];

      if (!updatedDisciplines) return;

      updatedDisciplines.push({
        ...disciplineData,
        isNew: true,
      });
      queryClient.setQueryData<DisciplineInterface[]>(['disciplines'], updatedDisciplines);

      console.log('addDisciplineMutate onMutate', previousDisciplines, updatedDisciplines);
      debugger;

      return { previousDisciplines, updatedDisciplines };
    },
    onError: (err, _variables, context) => {
      console.log('addDisciplineMutate  err', err);
      debugger;

      queryClient.setQueryData<DisciplineInterface[]>(['disciplines'], context?.previousDisciplines);
    },
    onSuccess: async () => {
      console.log('addDisciplineMutate  onSuccess');
      debugger;
      refetch();
    },
  });

  return {
    disciplines: data ?? [],
    deleteDisciplineMutate: deleteDisciplineMutate.mutate,
    addDisciplineMutate: addDisciplineMutate.mutate,
  };
};

export default useDisciplines;
