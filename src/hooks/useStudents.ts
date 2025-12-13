import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { addStudentApi, deleteStudentApi, getStudentsApi } from '@/api/studentsApi';
import type StudentInterface from '@/types/StudentInterface';

interface StudentsHookInterface {
  students: StudentInterface[];
  isLoading: boolean;
  deleteStudentMutate: (_id: number) => void;
  addStudentMutate: (_studentData: StudentInterface) => void;
}

const useStudents = (): StudentsHookInterface => {
  const queryClient = useQueryClient();

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => getStudentsApi(),
    enabled: true,
  });

  /**
   * Мутация удаления студента
   */
  const deleteStudentMutate = useMutation({
    // вызов API delete
    mutationFn: async (id: number) => deleteStudentApi(id),
    // оптимистичная мутация (обновляем данные на клиенте до API запроса delete)
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      // получаем данные из TanStackQuery
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']);
      let updatedStudents = [...(previousStudents ?? [])];

      if (!updatedStudents) return;

      // помечаем удаляемую запись
      updatedStudents = updatedStudents.map((student: StudentInterface) => ({
        ...student,
        ...(student.id === id ? { isDeleted: true } : {}),
      }));
      // обновляем данные в TanStackQuery
      queryClient.setQueryData<StudentInterface[]>(['students'], updatedStudents);

      console.log('deleteStudentMutate onMutate', previousStudents, updatedStudents);
      debugger;

      return { previousStudents, updatedStudents };
    },
    onError: (err, _variables, context) => {
      console.log('deleteStudentMutate  err', err);
      debugger;
      queryClient.setQueryData<StudentInterface[]>(['students'], context?.previousStudents);
    },
    // обновляем данные в случаи успешного выполнения mutationFn: async (id: number) => deleteStudentApi(id),
    onSuccess: async (_result, id, context) => {
      console.log('deleteStudentMutate  onSuccess', id);
      debugger;

      await queryClient.cancelQueries({ queryKey: ['students'] });
      // вариант 1 - запрос всех записей
      // refetch();

      // вариант 2 - удаление конкретной записи
      if (!context?.previousStudents) {
        return;
      }
      const updatedStudents = context.previousStudents.filter((student: StudentInterface) => student.id !== id);
      queryClient.setQueryData<StudentInterface[]>(['students'], updatedStudents);
    },
    // onSettled: (data, error, variables, context) => {
    //   // вызывается после выполнения запроса в случаи удачи или ошибке
    //   console.log('>> deleteStudentMutate onSettled', data, error, variables, context);
    // },
  });

  const addStudentMutate = useMutation({
    mutationFn: async (studentData: StudentInterface) => addStudentApi(studentData),

    onMutate: async (studentData: StudentInterface) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      // получаем данные из TanStackQuery
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']);
      const updatedStudents = [...(previousStudents ?? [])];

      if (!updatedStudents) return;

      // добавляем временную запись
      updatedStudents.push({
        ...studentData,
        isNew: true,
      });
      // обновляем данные в TanStackQuery
      queryClient.setQueryData<StudentInterface[]>(['students'], updatedStudents);

      console.log('addStudentMutate onMutate', previousStudents, updatedStudents);
      debugger;

      return { previousStudents, updatedStudents };
    },
    onError: (err, _variables, context) => {
      console.log('addStudentMutate  err', err);
      debugger;

      queryClient.setQueryData<StudentInterface[]>(['students'], context?.previousStudents);
    },
    // обновляем данные в случаи успешного выполнения mutationFn: async (studentData: StudentInterface) => addStudentApi(studentData)
    onSuccess: async () => {
      console.log('addStudentMutate  onSuccess');
      debugger;
      refetch();
      // await queryClient.cancelQueries({ queryKey: ['students'] });

      // if (!previousStudents) {
      //   queryClient.setQueryData<StudentInterface[]>(['students'], [newStudent]);
      //   return;
      // }

      // const updatedStudents = [...previousStudents.filter(s => s.id !== -1), newStudent];
      // queryClient.setQueryData<StudentInterface[]>(['students'], updatedStudents);
    },
  });

  return {
    students: data ?? [],
    isLoading,
    deleteStudentMutate: deleteStudentMutate.mutate,
    addStudentMutate: addStudentMutate.mutate,
  };
};

export default useStudents;
