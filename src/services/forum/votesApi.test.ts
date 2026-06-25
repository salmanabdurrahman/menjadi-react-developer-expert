import { describe, expect, it, vi } from 'vitest';

import {
  downVoteComment,
  downVoteThread,
  neutralVoteComment,
  neutralVoteThread,
  upVoteComment,
  upVoteThread,
} from '@/services/forum/votesApi';

vi.mock('@/services/apiClient', () => ({
  apiClient: vi.fn(),
}));

describe('votesApi', () => {
  it('upVoteThread calls thread up-vote endpoint', async () => {
    const { apiClient } = await import('@/services/apiClient');
    vi.mocked(apiClient).mockResolvedValueOnce({
      message: 'ok',
      voteType: 1,
    } as never);

    await upVoteThread('thread-1');

    expect(apiClient).toHaveBeenCalledWith('/threads/thread-1/up-vote', {
      method: 'POST',
    });
  });

  it('downVoteThread calls thread down-vote endpoint', async () => {
    const { apiClient } = await import('@/services/apiClient');
    vi.mocked(apiClient).mockResolvedValueOnce({
      message: 'ok',
      voteType: -1,
    } as never);

    await downVoteThread('thread-1');

    expect(apiClient).toHaveBeenCalledWith('/threads/thread-1/down-vote', {
      method: 'POST',
    });
  });

  it('neutralVoteThread calls thread neutral-vote endpoint', async () => {
    const { apiClient } = await import('@/services/apiClient');
    vi.mocked(apiClient).mockResolvedValueOnce({
      message: 'ok',
      voteType: 0,
    } as never);

    await neutralVoteThread('thread-1');

    expect(apiClient).toHaveBeenCalledWith('/threads/thread-1/neutral-vote', {
      method: 'POST',
    });
  });

  it('upVoteComment calls comment up-vote endpoint', async () => {
    const { apiClient } = await import('@/services/apiClient');
    vi.mocked(apiClient).mockResolvedValueOnce({
      message: 'ok',
      voteType: 1,
    } as never);

    await upVoteComment('thread-1', 'comment-1');

    expect(apiClient).toHaveBeenCalledWith('/threads/thread-1/comments/comment-1/up-vote', {
      method: 'POST',
    });
  });

  it('downVoteComment calls comment down-vote endpoint', async () => {
    const { apiClient } = await import('@/services/apiClient');
    vi.mocked(apiClient).mockResolvedValueOnce({
      message: 'ok',
      voteType: -1,
    } as never);

    await downVoteComment('thread-1', 'comment-1');

    expect(apiClient).toHaveBeenCalledWith('/threads/thread-1/comments/comment-1/down-vote', {
      method: 'POST',
    });
  });

  it('neutralVoteComment calls comment neutral-vote endpoint', async () => {
    const { apiClient } = await import('@/services/apiClient');
    vi.mocked(apiClient).mockResolvedValueOnce({
      message: 'ok',
      voteType: 0,
    } as never);

    await neutralVoteComment('thread-1', 'comment-1');

    expect(apiClient).toHaveBeenCalledWith('/threads/thread-1/comments/comment-1/neutral-vote', {
      method: 'POST',
    });
  });
});
