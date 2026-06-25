import { describe, expect, test } from 'vitest';

import { fetchLeaderboards, leaderboardsReducer } from '@/store/slices/leaderboardsSlice';

describe('leaderboardsSlice', () => {
  test('fetchLeaderboards pending sets loading state', () => {
    const state = leaderboardsReducer(
      {
        error: 'lama',
        items: [{ score: 1, user: { avatar: '', email: '', id: '1', name: 'A' } }],
        status: 'idle',
      },
      fetchLeaderboards.pending('request-1', undefined),
    );

    expect(state).toEqual({
      error: null,
      items: [{ score: 1, user: { avatar: '', email: '', id: '1', name: 'A' } }],
      status: 'loading',
    });
  });

  test('fetchLeaderboards fulfilled stores leaderboard items', () => {
    const items = [
      {
        score: 20,
        user: {
          avatar: 'https://example.com/a.png',
          email: 'a@x.com',
          id: '1',
          name: 'A',
        },
      },
    ];

    const state = leaderboardsReducer(
      {
        error: 'lama',
        items: [],
        status: 'loading',
      },
      fetchLeaderboards.fulfilled(items, 'request-1', undefined),
    );

    expect(state).toEqual({
      error: null,
      items,
      status: 'succeeded',
    });
  });

  test('fetchLeaderboards rejected stores readable error', () => {
    const state = leaderboardsReducer(
      {
        error: null,
        items: [],
        status: 'loading',
      },
      fetchLeaderboards.rejected(null, 'request-1', undefined, 'Gagal'),
    );

    expect(state).toEqual({
      error: 'Gagal',
      items: [],
      status: 'failed',
    });
  });
});
