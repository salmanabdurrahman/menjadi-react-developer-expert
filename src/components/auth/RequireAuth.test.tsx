import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { RequireAuth } from '@/components/auth/RequireAuth';

const authedUser = {
  avatar: 'https://example.com/avatar.png',
  email: 'budi@example.com',
  id: 'user-1',
  name: 'Budi',
};

let authState = {
  authedUser: null as typeof authedUser | null,
  status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
  token: null as string | null,
};

vi.mock('@/hooks', () => ({
  useAppSelector: (selector: (state: { auth: typeof authState }) => unknown) =>
    selector({ auth: authState }),
}));

function LoginRoute() {
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '';

  return <p>Halaman masuk {from}</p>;
}

function renderProtectedRoute() {
  render(
    <MemoryRouter initialEntries={['/threads/new?draft=true']}>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/threads/new" element={<p>Form thread baru</p>} />
        </Route>
        <Route path="/login" element={<LoginRoute />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RequireAuth', () => {
  beforeEach(() => {
    authState = {
      authedUser: null,
      status: 'idle',
      token: null,
    };
  });

  test('redirects guest to login page', () => {
    renderProtectedRoute();

    expect(screen.getByText('Halaman masuk /threads/new?draft=true')).toBeInTheDocument();
  });

  test('waits while stored token session is being restored', () => {
    authState = {
      authedUser: null,
      status: 'idle',
      token: 'token-123',
    };

    renderProtectedRoute();

    expect(screen.getByText('Memeriksa sesi…')).toBeInTheDocument();
  });

  test('redirects invalid stored token to login page', () => {
    authState = {
      authedUser: null,
      status: 'failed',
      token: 'token-123',
    };

    renderProtectedRoute();

    expect(screen.getByText('Halaman masuk /threads/new?draft=true')).toBeInTheDocument();
  });

  test('renders protected content when session is valid', () => {
    authState = {
      authedUser,
      status: 'succeeded',
      token: 'token-123',
    };

    renderProtectedRoute();

    expect(screen.getByText('Form thread baru')).toBeInTheDocument();
  });
});
