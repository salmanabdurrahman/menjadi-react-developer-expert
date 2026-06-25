import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from '@/layouts';
import { RequireAuth } from '@/components/auth/RequireAuth';
import {
  CreateThreadPage,
  LeaderboardsPage,
  LoginPage,
  NotFoundPage,
  RegisterPage,
  ThreadDetailPage,
  ThreadListPage,
} from '@/pages';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <ThreadListPage /> },
      { path: 'threads/:threadId', element: <ThreadDetailPage /> },
      {
        element: <RequireAuth />,
        children: [{ path: 'threads/new', element: <CreateThreadPage /> }],
      },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'leaderboards', element: <LeaderboardsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
