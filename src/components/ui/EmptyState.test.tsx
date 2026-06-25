import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EmptyState } from '@/components/ui/EmptyState';

describe('EmptyState', () => {
  it('renders empty message', () => {
    render(<EmptyState message="Belum ada data" title="Kosong" />);

    expect(screen.getByText('Kosong')).toBeInTheDocument();
    expect(screen.getByText('Belum ada data')).toBeInTheDocument();
  });
});
