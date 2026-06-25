import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { LoadingState } from '@/components/ui/LoadingState';

describe('LoadingState', () => {
  test('renders label and skeleton bars', () => {
    render(<LoadingState label="Memuat thread…" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Memuat thread…')).toBeInTheDocument();
  });
});
