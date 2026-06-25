import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { LoadingState } from '@/components/ui';
import { useAppSelector } from '@/hooks';

export function RequireAuth() {
  const location = useLocation();
  const { authedUser, status, token } = useAppSelector((state) => state.auth);

  if (token !== null && authedUser === null && status !== 'failed') {
    return <LoadingState label="Memeriksa sesi…" />;
  }

  if (token === null || authedUser === null) {
    return (
      <Navigate replace state={{ from: `${location.pathname}${location.search}` }} to="/login" />
    );
  }

  return <Outlet />;
}
