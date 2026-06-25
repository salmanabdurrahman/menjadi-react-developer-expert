import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { CommentForm } from '@/features/comments/CommentForm';

describe('CommentForm', () => {
  test('shows validation error on empty submit', async () => {
    const user = userEvent.setup();

    render(<CommentForm onSubmit={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Kirim komentar' }));

    expect(screen.getByText('Komentar wajib diisi.')).toBeInTheDocument();
  });

  test('submits trimmed content and clears field', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<CommentForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Tulis komentar'), '  Halo forum  ');
    await user.click(screen.getByRole('button', { name: 'Kirim komentar' }));

    expect(onSubmit).toHaveBeenCalledWith('Halo forum');
    expect(screen.getByLabelText('Tulis komentar')).toHaveValue('');
  });
});
