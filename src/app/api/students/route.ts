import { getStudentsDb, addStudentDb } from '@/db/studentDb';
import { type NextApiRequest } from 'next/types';

export async function GET(): Promise<Response> {
  const students = await getStudentsDb();

  return new Response(JSON.stringify(students), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export async function POST(req: NextApiRequest): Promise<Response> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const student = await req.json();
  delete student['id'];
  const newStudent = await addStudentDb(student);

  console.log(newStudent);
  return new Response(JSON.stringify(newStudent), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
