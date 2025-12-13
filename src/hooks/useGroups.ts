import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { getGroupsApi, addGroupApi, deleteGroupApi, updateGroupApi } from '@/api/groupsApi';
import type GroupInterface from '@/types/GroupInterface';

interface GroupsHookInterface {
  groups: GroupInterface[];
  addGroupMutate: (group: Omit<GroupInterface, 'id'>) => void;
  deleteGroupMutate: (groupId: number) => void;
  updateGroupMutate: (groupId: number, groupFields: Partial<Omit<GroupInterface, 'id'>>) => void;
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
    mutationFn: async (group: Omit<GroupInterface, 'id'>) => addGroupApi({ id: -1, ...group }),

    onMutate: async (group: Omit<GroupInterface, 'id'>) => {
      await queryClient.cancelQueries({ queryKey: ['groups'] });
      const previousGroups = queryClient.getQueryData<GroupInterface[]>(['groups']);
      const updatedGroups = [...(previousGroups ?? [])];

      if (!updatedGroups) return;

      updatedGroups.push({
        ...group,
        id: -1,
      } as GroupInterface);
      queryClient.setQueryData<GroupInterface[]>(['groups'], updatedGroups);

      console.log('addGroupMutate onMutate', previousGroups, updatedGroups);
      debugger;

      return { previousGroups, updatedGroups };
    },
    onError: (err, variables, context) => {
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
    mutationFn: async (groupId: number) => deleteGroupApi(groupId),
    onMutate: async (groupId: number) => {
      await queryClient.cancelQueries({ queryKey: ['groups'] });
      const previousGroups = queryClient.getQueryData<GroupInterface[]>(['groups']);
      let updatedGroups = [...(previousGroups ?? [])];

      if (!updatedGroups) return;

      updatedGroups = updatedGroups.map((group: GroupInterface) => ({
        ...group,
        ...(group.id === groupId ? { isDeleted: true } : {}),
      }));
      queryClient.setQueryData<GroupInterface[]>(['groups'], updatedGroups);

      console.log('deleteGroupMutate onMutate', previousGroups, updatedGroups);
      debugger;

      return { previousGroups, updatedGroups };
    },
    onError: (err, variables, context) => {
      console.log('deleteGroupMutate  err', err);
      debugger;
      queryClient.setQueryData<GroupInterface[]>(['groups'], context?.previousGroups);
    },
    onSuccess: async (groupId, variables, { previousGroups }) => {
      console.log('deleteGroupMutate  onSuccess', groupId);
      debugger;

      await queryClient.cancelQueries({ queryKey: ['groups'] });
      if (!previousGroups) {
        return;
      }
      const updatedGroups = previousGroups.filter((group: GroupInterface) => group.id !== groupId);
      queryClient.setQueryData<GroupInterface[]>(['groups'], updatedGroups);
    },
  });

  /**
   * Мутация обновления группы
   */
  const updateGroupMutate = useMutation({
    mutationFn: async ({ groupId, groupFields }: { groupId: number; groupFields: Partial<Omit<GroupInterface, 'id'>> }) =>
      updateGroupApi(groupId, groupFields),
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
    updateGroupMutate: (groupId: number, groupFields: Partial<Omit<GroupInterface, 'id'>>) =>
      updateGroupMutate.mutate({ groupId, groupFields }),
  };
};

export default useGroups;
