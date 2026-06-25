import { describe, expect, test, vi } from 'vitest';

import { createComment } from '@/features/comments/commentsApi';

vi.mock('@/services/apiClient', () => ({
  apiClient: vi.fn(),
}));

describe('commentsApi', () => {
  test('createComment calls comment endpoint with payload', async () => {
    const { apiClient } = await import('@/services/apiClient');
    vi.mocked(apiClient).mockResolvedValueOnce({
      message: 'ok',
      comment: {},
    } as never);

    await createComment('thread-1', { content: 'Komentar baru' });

    expect(apiClient).toHaveBeenCalledWith('/threads/thread-1/comments', {
      body: { content: 'Komentar baru' },
      method: 'POST',
    });
  });
});
