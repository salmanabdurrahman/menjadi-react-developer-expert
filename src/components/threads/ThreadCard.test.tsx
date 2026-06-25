import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import type { ThreadWithOwner } from '@/store/slices/threadsSlice';
import { ThreadCard } from '@/components/threads/ThreadCard';

interface MockVoteButtonProps {
  activeType?: number;
  onVote?: (voteType: number) => void | Promise<void>;
  score: number;
}

vi.mock('@/components/votes', () => ({
  VoteButton: ({ activeType, onVote, score }: MockVoteButtonProps) => (
    <button
      aria-label={`vote-${activeType}`}
      onClick={() => {
        void onVote?.(1);
      }}
      type="button"
    >
      {score}
    </button>
  ),
  downVoteThread: vi.fn(),
  neutralVoteThread: vi.fn(),
  upVoteThread: vi.fn(),
}));

const thread: ThreadWithOwner = {
  body: `<p>${'Halo dunia '.repeat(20)}</p>`,
  category: 'React',
  createdAt: '2026-06-25T11:55:00.000Z',
  downVotesBy: ['u3'],
  id: 'thread-1',
  owner: {
    avatar: 'https://example.com/avatar.png',
    email: 'budi@example.com',
    id: 'u1',
    name: 'Budi',
  },
  ownerId: 'u1',
  title: 'Belajar React',
  totalComments: 1,
  upVotesBy: ['u2'],
};

describe('ThreadCard', () => {
  it('renders title link, category, owner, and comment count', () => {
    render(
      <MemoryRouter>
        <ThreadCard thread={thread} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Belajar React' })).toHaveAttribute(
      'href',
      '/threads/thread-1',
    );
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Budi')).toBeInTheDocument();
    expect(screen.getByText('1 komentar')).toBeInTheDocument();
  });

  it('renders singular comment text when count is one', () => {
    render(
      <MemoryRouter>
        <ThreadCard thread={thread} />
      </MemoryRouter>,
    );

    expect(screen.getByText('1 komentar')).toBeInTheDocument();
  });

  it('renders truncated body summary', () => {
    render(
      <MemoryRouter>
        <ThreadCard thread={thread} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Halo dunia.*…/)).toBeInTheDocument();
  });
});
