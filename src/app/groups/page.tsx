import Groups from '@/components/Groups/Groups';
import Page from '@/components/layout/Page/Page';
import ProtectedRoute from '@/components/Auth/ProtectedRoute/ProtectedRoute';
import { UserRole } from '@/db/entity/User.entity';
import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';
import { type Metadata } from 'next/types';

export const metadata: Metadata = {
  title: `Группы - ${META_TITLE}`,
  description: META_DESCRIPTION,
};

const GroupsPage = (): React.ReactNode => (
  <Page>
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <h1>Группы</h1>
      <Groups />
    </ProtectedRoute>
  </Page>
);

export default GroupsPage;
