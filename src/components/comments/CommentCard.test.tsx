import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';

import { CommentCard } from '@/components/comments/CommentCard';

const voteApiMocks = vi.hoisted(() => ({
  upVoteComment: vi.fn(),
}));

vi.mock('@/components/votes', () => ({
  VoteButton: ({ onVote, score }: { onVote?: (voteType: number) => void; score: number }) => (
    <button
      onClick={() => {
        onVote?.(1);
      }}
      type="button"
    >
      Vote {score}
    </button>
  ),
}));

vi.mock('@/services/forum/votesApi', () => ({
  downVoteComment: vi.fn(),
  neutralVoteComment: vi.fn(),
  upVoteComment: (...args: unknown[]) => {
    voteApiMocks.upVoteComment(...args);
    return Promise.resolve({});
  },
}));

const comment = {
  content: '<p>Komentar aman</p>',
  createdAt: '2026-06-25T00:00:00.000Z',
  downVotesBy: [] as string[],
  id: 'comment-1',
  owner: {
    avatar: 'https://example.com/avatar.png',
    email: 'budi@example.com',
    id: 'user-1',
    name: 'Budi',
  },
  upVotesBy: [] as string[],
};

describe('CommentCard', () => {
  test('renders owner, content, and vote score', () => {
    render(
      <MemoryRouter>
        <CommentCard comment={comment} threadId="thread-1" />
      </MemoryRouter>,
    );

    expect(screen.getByText('Budi')).toBeInTheDocument();
    expect(screen.getByText('Komentar aman')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vote 0' })).toBeInTheDocument();
  });

  test('calls vote API for authenticated user', async () => {
    const user = userEvent.setup();
    voteApiMocks.upVoteComment.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <CommentCard authedUserId="user-1" comment={comment} threadId="thread-1" />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Vote 0' }));

    expect(voteApiMocks.upVoteComment).toHaveBeenCalledWith('thread-1', 'comment-1');
  });
});
