import { describe, expect, test, vi, type MockedFunction } from 'vitest';

import { createThread, getThreadDetail } from '@/services/forum/threadsApi';

vi.mock('@/services/apiClient', () => ({
  apiClient: vi.fn(),
}));

describe('threadsApi', () => {
  test('getThreadDetail calls thread detail endpoint', async () => {
    const { apiClient } = await import('@/services/apiClient');
    const mockedApiClient = apiClient as MockedFunction<typeof apiClient>;
    mockedApiClient.mockResolvedValueOnce({
      message: 'ok',
      detailThread: {},
    } as never);

    await getThreadDetail('thread-1');

    expect(mockedApiClient).toHaveBeenCalledWith('/threads/thread-1');
  });

  test('createThread calls create endpoint with payload', async () => {
    const { apiClient } = await import('@/services/apiClient');
    const mockedApiClient = apiClient as MockedFunction<typeof apiClient>;
    mockedApiClient.mockResolvedValueOnce({
      message: 'ok',
      thread: {},
    } as never);

    await createThread({
      body: 'Isi thread',
      category: 'General',
      title: 'Judul thread',
    });

    expect(mockedApiClient).toHaveBeenCalledWith('/threads', {
      body: {
        body: 'Isi thread',
        category: 'General',
        title: 'Judul thread',
      },
      method: 'POST',
    });
  });
});
