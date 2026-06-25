import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { EmptyState } from '@/components/ui/EmptyState';

describe('EmptyState', () => {
  test('renders empty message', () => {
    render(<EmptyState message="Belum ada data" title="Kosong" />);

    expect(screen.getByText('Kosong')).toBeInTheDocument();
    expect(screen.getByText('Belum ada data')).toBeInTheDocument();
  });
});
