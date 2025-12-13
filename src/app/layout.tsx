import { dehydrate } from '@tanstack/react-query';
import 'reflect-metadata';
import TanStackQuery from '@/containers/TanStackQuery';
import queryClient from '@/api/reactQueryClient';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import Main from '@/components/layout/Main/Main';
import { getGroupsDb } from '@/db/groupDb';
import { getStudentsDb } from '@/db/studentDb';

import type { Metadata, Viewport } from 'next';

import '@/styles/globals.scss';
import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>): Promise<React.ReactElement> => {
  // выполняется на сервере - загрузка групп напрямую из БД
  try {
    await queryClient.prefetchQuery({
      queryKey: ['groups'],
      queryFn: async () => {
        const groups = await getGroupsDb();
        // Преобразуем entity объекты в plain objects для сериализации
        return groups.map(group => ({ ...group }));
      },
    });
  }
  catch (error) {
    console.error('Error prefetching groups in layout:', error);
  }

  // выполняется на сервере - загрузка студентов напрямую из БД
  try {
    await queryClient.prefetchQuery({
      queryKey: ['students'],
      queryFn: async () => {
        const students = await getStudentsDb();
        // Преобразуем entity объекты в plain objects для сериализации
        return students.map(student => ({ ...student }));
      },
    });
  }
  catch (error) {
    console.error('Error prefetching students in layout:', error);
  }

  // дегидрация состояния
  const state = dehydrate(queryClient, { shouldDehydrateQuery: () => true });

  return (
    <TanStackQuery state={state}>
      <html lang="ru">
        <body>
          <Header />
          <Main>
            <>{children}</>
          </Main>
          <Footer />
        </body>
      </html>
    </TanStackQuery>
  );
};

export default RootLayout;
