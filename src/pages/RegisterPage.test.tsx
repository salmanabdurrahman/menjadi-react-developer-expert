import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';

import { RegisterPage } from '@/pages/RegisterPage';

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

describe('RegisterPage', () => {
  test('renders fields and login link', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText('Nama')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Masuk' })).toHaveAttribute('href', '/login');
  });

  test('shows validation error on empty submit', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Daftar' }));

    expect(screen.getByText('Nama wajib diisi.')).toBeInTheDocument();
    expect(screen.getByText('Email wajib diisi.')).toBeInTheDocument();
    expect(screen.getByText('Password wajib diisi.')).toBeInTheDocument();
  });

  test('shows min password validation error', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText('Nama'), 'Budi');
    await user.type(screen.getByLabelText('Email'), 'budi@example.com');
    await user.type(screen.getByLabelText('Password'), '123');
    await user.click(screen.getByRole('button', { name: 'Daftar' }));

    expect(screen.getByText('Password minimal 6 karakter.')).toBeInTheDocument();
  });
});
