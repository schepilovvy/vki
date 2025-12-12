import Search from '@/components/Search/Search';
import Page from '@/components/layout/Page/Page';
import ProtectedRoute from '@/components/Auth/ProtectedRoute/ProtectedRoute';
import { UserRole } from '@/db/entity/User.entity';
import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';
import { type Metadata } from 'next/types';

export const metadata: Metadata = {
  title: `Поиск - ${META_TITLE}`,
  description: META_DESCRIPTION,
};

const SearchPage = (): React.ReactNode => (
  <Page>
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <h1>Поиск</h1>
      <Search />
    </ProtectedRoute>
  </Page>
);

export default SearchPage;

