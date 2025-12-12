import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { addDisciplineApi, deleteDisciplineApi, getDisciplinesApi } from '@/api/disciplinesApi';
import type DisciplineInterface from '@/types/DisciplineInterface';

interface DisciplinesHookInterface {
  disciplines: DisciplineInterface[];
  deleteDisciplineMutate: (disciplineId: number) => void;
  addDisciplineMutate: (discipline: DisciplineInterface) => void;
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
    mutationFn: async (disciplineId: number) => deleteDisciplineApi(disciplineId),
    onMutate: async (disciplineId: number) => {
      await queryClient.cancelQueries({ queryKey: ['disciplines'] });
      const previousDisciplines = queryClient.getQueryData<DisciplineInterface[]>(['disciplines']);
      let updatedDisciplines = [...(previousDisciplines ?? [])];

      if (!updatedDisciplines) return;

      updatedDisciplines = updatedDisciplines.map((discipline: DisciplineInterface) => ({
        ...discipline,
        ...(discipline.id === disciplineId ? { isDeleted: true } : {}),
      }));
      queryClient.setQueryData<DisciplineInterface[]>(['disciplines'], updatedDisciplines);

      console.log('deleteDisciplineMutate onMutate', previousDisciplines, updatedDisciplines);
      debugger;

      return { previousDisciplines, updatedDisciplines };
    },
    onError: (err, variables, context) => {
      console.log('deleteDisciplineMutate  err', err);
      debugger;
      queryClient.setQueryData<DisciplineInterface[]>(['disciplines'], context?.previousDisciplines);
    },
    onSuccess: async (disciplineId, variables, { previousDisciplines }) => {
      console.log('deleteDisciplineMutate  onSuccess', disciplineId);
      debugger;

      await queryClient.cancelQueries({ queryKey: ['disciplines'] });
      if (!previousDisciplines) {
        return;
      }
      const updatedDisciplines = previousDisciplines.filter((discipline: DisciplineInterface) => discipline.id !== disciplineId);
      queryClient.setQueryData<DisciplineInterface[]>(['disciplines'], updatedDisciplines);
    },
  });

  const addDisciplineMutate = useMutation({
    mutationFn: async (discipline: DisciplineInterface) => addDisciplineApi(discipline),

    onMutate: async (discipline: DisciplineInterface) => {
      await queryClient.cancelQueries({ queryKey: ['disciplines'] });
      const previousDisciplines = queryClient.getQueryData<DisciplineInterface[]>(['disciplines']);
      const updatedDisciplines = [...(previousDisciplines ?? [])];

      if (!updatedDisciplines) return;

      updatedDisciplines.push({
        ...discipline,
        isNew: true,
      });
      queryClient.setQueryData<DisciplineInterface[]>(['disciplines'], updatedDisciplines);

      console.log('addDisciplineMutate onMutate', previousDisciplines, updatedDisciplines);
      debugger;

      return { previousDisciplines, updatedDisciplines };
    },
    onError: (err, variables, context) => {
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


