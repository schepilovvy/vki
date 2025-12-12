import Login from '@/components/Auth/Login/Login';
import Page from '@/components/layout/Page/Page';
import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';
import { type Metadata } from 'next/types';

export const metadata: Metadata = {
  title: `Вход - ${META_TITLE}`,
  description: META_DESCRIPTION,
};

const LoginPage = (): React.ReactNode => (
  <Page>
    <Login />
  </Page>
);

export default LoginPage;
