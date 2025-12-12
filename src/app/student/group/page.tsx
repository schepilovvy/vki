import StudentMode from '@/components/StudentMode/StudentMode';
import Page from '@/components/layout/Page/Page';
import ProtectedRoute from '@/components/Auth/ProtectedRoute/ProtectedRoute';
import { UserRole } from '@/db/entity/User.entity';
import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';
import { type Metadata } from 'next/types';

export const metadata: Metadata = {
  title: `Моя группа - ${META_TITLE}`,
  description: META_DESCRIPTION,
};

const StudentGroupPage = (): React.ReactNode => (
  <Page>
    <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
      <StudentMode activeTab="group" />
    </ProtectedRoute>
  </Page>
);

export default StudentGroupPage;


