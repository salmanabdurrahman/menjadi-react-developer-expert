import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { Textarea } from '@/components/ui/Textarea';

describe('Textarea', () => {
  test('shows error message and aria state', () => {
    render(<Textarea error="Wajib diisi" label="Isi" name="body" />);

    const textarea = screen.getByRole('textbox', { name: /isi/i });

    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Wajib diisi')).toBeInTheDocument();
  });
});
