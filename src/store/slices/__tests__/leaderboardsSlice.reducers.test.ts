import { describe, expect, it } from 'vitest';

import { makeLeaderboardItem } from '@/test/factories';
import { fetchLeaderboards, leaderboardsReducer } from '@/store/slices/leaderboardsSlice';

const items = [makeLeaderboardItem({ score: 42 })];

describe('leaderboardsSlice reducer states', () => {
  it('starts with empty state', () => {
    expect(leaderboardsReducer(undefined, { type: 'unknown' })).toEqual({
      error: null,
      items: [],
      status: 'idle',
    });
  });

  it('pending clears error but keeps old items visible', () => {
    const state = leaderboardsReducer(
      { error: 'lama', items, status: 'failed' },
      fetchLeaderboards.pending('request-1', undefined),
    );

    expect(state).toEqual({ error: null, items, status: 'loading' });
  });

  it('fulfilled stores non-empty result', () => {
    const state = leaderboardsReducer(
      undefined,
      fetchLeaderboards.fulfilled(items, 'request-1', undefined),
    );

    expect(state).toEqual({ error: null, items, status: 'succeeded' });
  });

  it('fulfilled stores empty result for empty leaderboard', () => {
    const state = leaderboardsReducer(
      { error: 'lama', items, status: 'loading' },
      fetchLeaderboards.fulfilled([], 'request-1', undefined),
    );

    expect(state).toEqual({ error: null, items: [], status: 'succeeded' });
  });

  it('rejected stores fallback payload and keeps previous items', () => {
    const state = leaderboardsReducer(
      { error: null, items, status: 'loading' },
      fetchLeaderboards.rejected(null, 'request-1', undefined, 'Papan peringkat gagal dimuat.'),
    );

    expect(state).toEqual({
      error: 'Papan peringkat gagal dimuat.',
      items,
      status: 'failed',
    });
  });
});
