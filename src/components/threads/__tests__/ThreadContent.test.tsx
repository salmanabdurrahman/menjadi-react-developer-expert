import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThreadContent } from '@/components/threads/ThreadContent';
import { makeThreadDetail } from '@/test/factories';
import { downVoteThread, neutralVoteThread, upVoteThread } from '@/services/forum/votesApi';

interface MockVoteButtonProps {
  activeType?: number;
  isLoading?: boolean;
  onVote?: (voteType: 1 | -1) => void | Promise<void>;
  score: number;
}

vi.mock('@/components/votes', () => ({
  VoteButton: ({ activeType, isLoading, onVote, score }: MockVoteButtonProps) => (
    <div>
      <span data-testid="vote-state">{activeType ?? 0}</span>
      <span data-testid="vote-score">{score}</span>
      <button disabled={isLoading} onClick={() => void onVote?.(1)} type="button">
        up
      </button>
      <button disabled={isLoading} onClick={() => void onVote?.(-1)} type="button">
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

const thread = makeThreadDetail({
  body: '<p>Konten <strong>aman</strong><script>alert("xss")</script></p>',
  downVotesBy: ['user-3'],
  id: 'thread-1',
  upVotesBy: ['user-2'],
});

describe('ThreadContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sanitized thread body and current vote score', () => {
    render(<ThreadContent authedUserId="user-1" thread={thread} />);

    expect(screen.getByRole('heading', { name: 'Isi Thread' })).toBeInTheDocument();
    expect(screen.getByText('Konten')).toBeInTheDocument();
    expect(screen.getByText('aman')).toBeInTheDocument();
    expect(screen.queryByText('alert("xss")')).not.toBeInTheDocument();
    expect(screen.getByTestId('vote-score')).toHaveTextContent('0');
  });

  it('calls up vote api and updates optimistic score', async () => {
    vi.mocked(upVoteThread).mockResolvedValueOnce({ message: 'ok', voteType: 1 });

    render(<ThreadContent authedUserId="user-1" thread={thread} />);
    fireEvent.click(screen.getByRole('button', { name: 'up' }));

    await waitFor(() => expect(upVoteThread).toHaveBeenCalledWith('thread-1'));
    expect(screen.getByTestId('vote-score')).toHaveTextContent('1');
    expect(screen.getByTestId('vote-state')).toHaveTextContent('1');
  });

  it('neutralizes existing up vote when active up button clicked', async () => {
    vi.mocked(neutralVoteThread).mockResolvedValueOnce({ message: 'netral', voteType: 0 });

    render(<ThreadContent authedUserId="user-1" thread={{ ...thread, upVotesBy: ['user-1'] }} />);
    fireEvent.click(screen.getByRole('button', { name: 'up' }));

    await waitFor(() => expect(neutralVoteThread).toHaveBeenCalledWith('thread-1'));
    expect(screen.getByTestId('vote-score')).toHaveTextContent('-1');
  });

  it('calls down vote api and shows error when request fails', async () => {
    vi.mocked(downVoteThread).mockRejectedValueOnce(new Error('Network error'));

    render(<ThreadContent authedUserId="user-1" thread={thread} />);
    fireEvent.click(screen.getByRole('button', { name: 'down' }));

    await waitFor(() => expect(downVoteThread).toHaveBeenCalledWith('thread-1'));
    expect(screen.getByText('Vote thread gagal diproses.')).toBeInTheDocument();
  });

  it('does not pass vote handler when user is anonymous', () => {
    render(<ThreadContent thread={thread} />);

    fireEvent.click(screen.getByRole('button', { name: 'up' }));

    expect(upVoteThread).not.toHaveBeenCalled();
  });
});
