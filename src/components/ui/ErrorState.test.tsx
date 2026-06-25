import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ErrorState } from '@/components/ui/ErrorState';

describe('ErrorState', () => {
  it('renders message and retry action', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <ErrorState
        actionLabel="Coba lagi"
        message="Thread gagal dimuat"
        onRetry={onRetry}
        title="Gagal"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Coba lagi' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
