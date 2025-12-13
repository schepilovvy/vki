'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loginApi, getCurrentUserApi, logoutApi } from '@/api/authApi';
import type { JWTPayload } from '@/utils/jwt';

interface AuthHookInterface {
  user: JWTPayload | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (_loginParam: string, _passwordParam: string) => Promise<void>;
  logout: () => void;
  refetch: () => void;
}

const useAuth = (): AuthHookInterface => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const { data: user = null, isLoading, refetch } = useQuery<JWTPayload | null>({
    queryKey: ['auth', 'user'],
    queryFn: getCurrentUserApi,
    enabled: !!token,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: ({ login, password }: { login: string; password: string }) => loginApi(login, password),
    onSuccess: (data) => {
      console.log('Login success:', data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      queryClient.setQueryData(['auth', 'user'], {
        userId: data.user.id,
        login: data.user.login,
        role: data.user.role,
        studentId: data.user.studentId,
        teacherId: data.user.teacherId,
      });
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  const login = async (loginParam: string, password: string): Promise<void> => {
    await loginMutation.mutateAsync({ login: loginParam, password });
  };

  const logout = (): void => {
    logoutApi();
    setToken(null);
    queryClient.setQueryData(['auth', 'user'], null);
    queryClient.clear();
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || loginMutation.isPending,
    login,
    logout,
    refetch: (): void => {
      refetch();
    },
  };
};

export default useAuth;
