import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { LoginPage } from '@/pages/LoginPage';

const navigateMock = vi.fn();
const dispatchMock = vi.fn();

vi.mock('@/hooks', () => ({
  useAppDispatch: () => dispatchMock,
  useAppSelector: (selector: (state: { auth: { error: null; status: 'idle' } }) => unknown) =>
    selector({ auth: { error: null, status: 'idle' } }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('LoginPage', () => {
  it('renders fields and login link', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /daftar sekarang/i })).toHaveAttribute(
      'href',
      '/register',
    );
  });

  it('shows validation error on empty submit', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    expect(screen.getByText('Email wajib diisi.')).toBeInTheDocument();
    expect(screen.getByText('Password wajib diisi.')).toBeInTheDocument();
  });
});
