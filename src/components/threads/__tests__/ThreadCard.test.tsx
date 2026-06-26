import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ThreadWithOwner } from '@/store/slices/threadsSlice';
import { ThreadCard } from '@/components/threads/ThreadCard';
import { downVoteThread, neutralVoteThread, upVoteThread } from '@/services/forum/votesApi';

interface MockVoteButtonProps {
  activeType?: number;
  onVote?: (voteType: number) => void | Promise<void>;
  score: number;
}

vi.mock('@/components/votes', () => ({
  VoteButton: ({ activeType, onVote, score }: MockVoteButtonProps) => (
    <div>
      <span data-testid="vote-state">{activeType ?? 0}</span>
      <span data-testid="vote-score">{score}</span>
      <button onClick={() => void onVote?.(1)} type="button">
        up
      </button>
      <button onClick={() => void onVote?.(-1)} type="button">
        down
      </button>
    </div>
  ),
}));

vi.mock('@/services/forum/votesApi', () => ({
  downVoteThread: vi.fn(),
  neutralVoteThread: vi.fn(),
  upVoteThread: vi.fn(),
}));

vi.mock('@/utils/toast', () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('uses fallback owner info when owner is missing', () => {
    render(
      <MemoryRouter>
        <ThreadCard thread={{ ...thread, owner: null }} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Pengguna tidak dikenal')).toBeInTheDocument();
  });

  it('calls up vote api and updates optimistic score', async () => {
    vi.mocked(upVoteThread).mockResolvedValueOnce({ message: 'ok', voteType: 1 });

    render(
      <MemoryRouter>
        <ThreadCard authedUserId="u1" thread={thread} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'up' }));

    await waitFor(() => expect(upVoteThread).toHaveBeenCalledWith('thread-1'));
    expect(screen.getByTestId('vote-score')).toHaveTextContent('1');
  });

  it('neutralizes existing down vote when active down button clicked', async () => {
    vi.mocked(neutralVoteThread).mockResolvedValueOnce({ message: 'netral', voteType: 0 });

    render(
      <MemoryRouter>
        <ThreadCard authedUserId="u1" thread={{ ...thread, downVotesBy: ['u1'] }} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'down' }));

    await waitFor(() => expect(neutralVoteThread).toHaveBeenCalledWith('thread-1'));
    expect(screen.getByTestId('vote-state')).toHaveTextContent('0');
  });

  it('shows vote error when down vote request fails', async () => {
    vi.mocked(downVoteThread).mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter>
        <ThreadCard authedUserId="u1" thread={thread} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'down' }));

    await waitFor(() => expect(downVoteThread).toHaveBeenCalledWith('thread-1'));
    expect(screen.getByText('Vote thread gagal diproses.')).toBeInTheDocument();
  });
});
