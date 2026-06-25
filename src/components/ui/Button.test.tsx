import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { Button } from '@/components/ui/Button';

describe('Button', () => {
  test('renders loading state and disables button', () => {
    render(
      <Button isLoading onClick={vi.fn()}>
        Simpan
      </Button>,
    );

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Memuat…')).toBeInTheDocument();
  });

  test('calls onClick when enabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Simpan</Button>);

    await user.click(screen.getByRole('button', { name: 'Simpan' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
