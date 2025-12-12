import Disciplines from '@/components/Disciplines/Disciplines';
import Page from '@/components/layout/Page/Page';
import ProtectedRoute from '@/components/Auth/ProtectedRoute/ProtectedRoute';
import { UserRole } from '@/db/entity/User.entity';
import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';
import { type Metadata } from 'next/types';

export const metadata: Metadata = {
  title: `Дисциплины - ${META_TITLE}`,
  description: META_DESCRIPTION,
};

const DisciplinesPage = (): React.ReactNode => (
  <Page>
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <h1>Дисциплины</h1>
      <Disciplines />
    </ProtectedRoute>
  </Page>
);

export default DisciplinesPage;

