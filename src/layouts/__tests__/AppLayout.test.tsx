import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppLayout } from '@/layouts/AppLayout';
import { useAppDispatch, useAppSelector } from '@/hooks';
import type { RootState } from '@/store';
import { makeUser } from '@/test/factories';

vi.mock('@/hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

const dispatch = vi.fn();
const selectAuthState = (auth: Partial<RootState['auth']>) => {
  vi.mocked(useAppSelector).mockImplementation((selector) =>
    selector({
      auth: {
        authedUser: null,
        error: null,
        status: 'idle',
        token: null,
        ...auth,
      },
    } as RootState),
  );
};

function renderLayout() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<AppLayout />} path="/">
          <Route element={<h1>Konten halaman</h1>} index />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('AppLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAppDispatch).mockReturnValue(dispatch);
  });

  it('renders header, outlet, and footer for guest', () => {
    selectAuthState({ token: null });

    renderLayout();

    expect(screen.getByRole('link', { name: 'Forum Diskusi' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Konten halaman' })).toBeInTheDocument();
    expect(
      screen.getByText('Dibangun dengan React, Redux, Vite, dan shadcn/ui.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Masuk' })).toBeInTheDocument();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('fetches authed user when token exists and user is missing', () => {
    selectAuthState({ authedUser: null, status: 'idle', token: 'token-1' });

    renderLayout();

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0]?.[0]).toEqual(expect.any(Function));
  });

  it('renders authenticated user and dispatches logout from header', () => {
    selectAuthState({
      authedUser: makeUser({ name: 'Budi' }),
      status: 'succeeded',
      token: 'token-1',
    });

    renderLayout();
    fireEvent.click(screen.getByRole('button', { name: 'Keluar' }));

    expect(screen.getAllByText('Budi')).toHaveLength(2);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0]?.[0]).toMatchObject({ type: 'auth/logout' });
  });
});
