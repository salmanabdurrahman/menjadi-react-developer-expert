import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { Input } from '@/components/ui/Input';

describe('Input', () => {
  test('shows error message and aria state', () => {
    render(<Input error="Wajib diisi" label="Judul" name="title" />);

    const input = screen.getByRole('textbox', { name: /judul/i });

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Wajib diisi')).toBeInTheDocument();
  });
});
