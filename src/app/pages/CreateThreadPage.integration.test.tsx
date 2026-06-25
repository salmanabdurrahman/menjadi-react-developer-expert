import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { CreateThreadPage } from '@/app/pages/CreateThreadPage';

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  navigate: vi.fn(),
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
  submitThread: vi.fn(),
}));

vi.mock('@/hooks', () => ({
  useAppDispatch: () => mocks.dispatch,
  useAppSelector: (selector: (state: unknown) => unknown) => selector({ auth: { status: 'idle' } }),
}));

vi.mock('@/features/threads/threadsSlice', () => ({
  fetchThreads: () => ({ type: 'threads/fetch' }),
  selectCategory: (category: string) => ({
    payload: category,
    type: 'threads/select',
  }),
  submitThread: (payload: unknown) => {
    mocks.submitThread(payload);
    return { payload, type: 'threads/submit' };
  },
}));

vi.mock('@/utils/toast', () => ({
  showErrorToast: mocks.showErrorToast,
  showSuccessToast: mocks.showSuccessToast,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

describe('CreateThreadPage integration', () => {
  beforeEach(() => {
    mocks.submitThread.mockReset();
    mocks.dispatch.mockReset();
    mocks.navigate.mockReset();
    mocks.showErrorToast.mockReset();
    mocks.showSuccessToast.mockReset();
  });

  test('validates required fields', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CreateThreadPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Buat thread' }));

    expect(screen.getByText('Judul thread wajib diisi.')).toBeInTheDocument();
    expect(screen.getByText('Isi thread wajib diisi.')).toBeInTheDocument();
  });

  test('submits thread and navigates home', async () => {
    const user = userEvent.setup();
    mocks.dispatch.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({ message: 'Thread berhasil dibuat' }),
    });

    render(
      <MemoryRouter>
        <CreateThreadPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText('Judul'), 'Thread baru');
    await user.type(screen.getByLabelText('Kategori'), 'React');
    await user.type(screen.getByLabelText('Isi thread'), 'Isi thread baru');
    await user.click(screen.getByRole('button', { name: 'Buat thread' }));

    expect(mocks.submitThread).toHaveBeenCalledWith({
      body: 'Isi thread baru',
      category: 'React',
      title: 'Thread baru',
    });
    expect(mocks.showSuccessToast).toHaveBeenCalledWith(
      { message: 'Thread berhasil dibuat' },
      'Thread berhasil dibuat.',
    );
    expect(mocks.navigate).toHaveBeenCalledWith('/', { replace: true });
  });
});
