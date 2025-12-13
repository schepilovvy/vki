import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { getGroupsApi, addGroupApi, deleteGroupApi, updateGroupApi } from '@/api/groupsApi';
import type GroupInterface from '@/types/GroupInterface';

interface GroupsHookInterface {
  groups: GroupInterface[];
  addGroupMutate: (_groupData: Omit<GroupInterface, 'id'>) => void;
  deleteGroupMutate: (_id: number) => void;
  updateGroupMutate: (_id: number, _fields: Partial<Omit<GroupInterface, 'id'>>) => void;
}

const useGroups = (): GroupsHookInterface => {
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ['groups'],
    queryFn: () => getGroupsApi(),
  });

  /**
   * Мутация добавления группы
   */
  const addGroupMutate = useMutation({
    mutationFn: async (groupData: Omit<GroupInterface, 'id'>) => addGroupApi({ id: -1, ...groupData }),

    onMutate: async (groupData: Omit<GroupInterface, 'id'>) => {
      await queryClient.cancelQueries({ queryKey: ['groups'] });
      const previousGroups = queryClient.getQueryData<GroupInterface[]>(['groups']);
      const updatedGroups = [...(previousGroups ?? [])];

      if (!updatedGroups) return;

      updatedGroups.push({
        ...groupData,
        id: -1,
      } as GroupInterface);
      queryClient.setQueryData<GroupInterface[]>(['groups'], updatedGroups);

      console.log('addGroupMutate onMutate', previousGroups, updatedGroups);
      debugger;

      return { previousGroups, updatedGroups };
    },
    onError: (err, _variables, context) => {
      console.log('addGroupMutate  err', err);
      debugger;
      queryClient.setQueryData<GroupInterface[]>(['groups'], context?.previousGroups);
    },
    onSuccess: async () => {
      console.log('addGroupMutate  onSuccess');
      debugger;
      refetch();
    },
  });

  /**
   * Мутация удаления группы
   */
  const deleteGroupMutate = useMutation({
    mutationFn: async (id: number) => deleteGroupApi(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['groups'] });
      const previousGroups = queryClient.getQueryData<GroupInterface[]>(['groups']);
      let updatedGroups = [...(previousGroups ?? [])];

      if (!updatedGroups) return;

      updatedGroups = updatedGroups.map((group: GroupInterface) => ({
        ...group,
        ...(group.id === id ? { isDeleted: true } : {}),
      }));
      queryClient.setQueryData<GroupInterface[]>(['groups'], updatedGroups);

      console.log('deleteGroupMutate onMutate', previousGroups, updatedGroups);
      debugger;

      return { previousGroups, updatedGroups };
    },
    onError: (err, _variables, context) => {
      console.log('deleteGroupMutate  err', err);
      debugger;
      queryClient.setQueryData<GroupInterface[]>(['groups'], context?.previousGroups);
    },
    onSuccess: async (_result, id, context) => {
      console.log('deleteGroupMutate  onSuccess', id);
      debugger;

      await queryClient.cancelQueries({ queryKey: ['groups'] });
      if (!context?.previousGroups) {
        return;
      }
      const updatedGroups = context.previousGroups.filter((group: GroupInterface) => group.id !== id);
      queryClient.setQueryData<GroupInterface[]>(['groups'], updatedGroups);
    },
  });

  /**
   * Мутация обновления группы
   */
  const updateGroupMutate = useMutation({
    mutationFn: async ({ id, fields }: { id: number; fields: Partial<Omit<GroupInterface, 'id'>> }) =>
      updateGroupApi(id, fields),
    onSuccess: async () => {
      console.log('updateGroupMutate  onSuccess');
      debugger;
      refetch();
    },
  });

  return {
    groups: data ?? [],
    addGroupMutate: addGroupMutate.mutate,
    deleteGroupMutate: deleteGroupMutate.mutate,
    updateGroupMutate: (id: number, fields: Partial<Omit<GroupInterface, 'id'>>) =>
      updateGroupMutate.mutate({ id, fields }),
  };
};

export default useGroups;
