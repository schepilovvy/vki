import { addGroupsDb } from '@/db/groupDb';
import { addStudentDb } from '@/db/studentDb';

export async function GET(): Promise<Response> {
  const newStudent = await addStudentDb({
    firstName: 'fname',
    lastName: 'lname',
    middleName: 'mname',
    groupId: 1,
  });

  const newGroup = await addGroupsDb({
    name: 'name',
    teacherId: 1,
    course: 1,
    specialty: 'Информационные системы и программирование',
  });

  console.log(newStudent, newGroup);

  return new Response(JSON.stringify({
    newStudent,
    newGroup,
  }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
