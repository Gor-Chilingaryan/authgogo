import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/hoc';
import { Main } from '@/layout/Main';
import { Login } from '@/features/auth/components/login/Index';
import { Registration } from '@/features/auth/components/registration/Index';
import { ForgotPassword } from '@/features/auth/components/forgot-password/Index';
import { NewPassword } from '@/features/auth/components/new-password/Index';
import { NavigationEdit } from '@/features/navigation/components/navigation-edit';
import { Messenger } from '@/features/conversations/components';
import { UserInfo } from '@/features/home-page/components/Index';

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/registration', element: <Registration /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/new-password/:token', element: <NewPassword /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Main />,
        children: [
          { path: '/home', element: <UserInfo /> },
          { path: '/messenger', element: <Messenger /> },
        ],
      },
      { path: '/navigation-edit', element: <NavigationEdit /> },
    ],
  },
  { path: '*', element: <Navigate to='/login' /> },
]);
