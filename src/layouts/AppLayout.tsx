import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { fetchAuthedUser, logout } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { Footer } from '@/layouts/Footer';
import { Header } from '@/layouts/Header';

export function AppLayout() {
  const dispatch = useAppDispatch();
  const { authedUser, status, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token !== null && authedUser === null && status === 'idle') {
      void dispatch(fetchAuthedUser());
    }
  }, [authedUser, dispatch, status, token]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        isAuthenticated={token !== null && authedUser !== null}
        onLogout={() => dispatch(logout())}
        userName={authedUser?.name}
      />
      <main className="min-h-[calc(100vh-8rem)]" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
