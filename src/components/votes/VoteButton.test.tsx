import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';

import { VoteButton } from '@/components/votes/VoteButton';

describe('VoteButton', () => {
  test('renders score and active up state', () => {
    render(<VoteButton activeType={1} onVote={vi.fn()} score={7} />);

    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /vote suka/i })).toBeInTheDocument();
  });

  test('disables buttons while loading', () => {
    render(<VoteButton activeType={0} isLoading onVote={vi.fn()} score={0} />);

    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getAllByRole('button')[0]).toBeDisabled();
  });

  test('calls onVote for up and down buttons', async () => {
    const user = userEvent.setup();
    const onVote = vi.fn();

    render(<VoteButton activeType={0} onVote={onVote} score={0} />);

    await user.click(screen.getByRole('button', { name: /vote suka/i }));
    await user.click(screen.getByRole('button', { name: /vote tidak suka/i }));

    expect(onVote).toHaveBeenNthCalledWith(1, 1);
    expect(onVote).toHaveBeenNthCalledWith(2, -1);
  });

  test('renders login link for guest', () => {
    render(
      <MemoryRouter>
        <VoteButton score={0} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Masuk untuk memberi vote' })).toHaveAttribute(
      'href',
      '/login',
    );
  });
});
