import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CategoryFilter } from '@/components/threads/CategoryFilter';

describe('CategoryFilter', () => {
  it('renders all options', () => {
    render(
      <CategoryFilter
        categories={['React', 'TypeScript']}
        onSelect={vi.fn()}
        selectedCategory="all"
      />,
    );

    expect(screen.getByRole('button', { name: 'Semua' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'TypeScript' })).toBeInTheDocument();
  });

  it('calls onSelect when option clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<CategoryFilter categories={['React']} onSelect={onSelect} selectedCategory="all" />);

    await user.click(screen.getByRole('button', { name: 'React' }));

    expect(onSelect).toHaveBeenCalledWith('React');
  });

  it('marks selected option with pressed state', () => {
    render(<CategoryFilter categories={['React']} onSelect={vi.fn()} selectedCategory="React" />);

    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders empty badge when no categories', () => {
    render(<CategoryFilter categories={[]} onSelect={vi.fn()} selectedCategory="all" />);

    expect(screen.getByText('Tidak ada kategori')).toBeInTheDocument();
  });
});
