import { describe, expect, test, vi, type MockedFunction } from 'vitest';

import { getLeaderboards } from '@/services/forum/leaderboardsApi';

vi.mock('@/services/apiClient', () => ({
  apiClient: vi.fn(),
}));

describe('leaderboardsApi', () => {
  test('getLeaderboards calls leaderboard endpoint', async () => {
    const { apiClient } = await import('@/services/apiClient');
    const mockedApiClient = apiClient as MockedFunction<typeof apiClient>;
    mockedApiClient.mockResolvedValueOnce({
      message: 'ok',
      leaderboards: [],
    } as never);

    await getLeaderboards();

    expect(mockedApiClient).toHaveBeenCalledWith('/leaderboards');
  });
});
