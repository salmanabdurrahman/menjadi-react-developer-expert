import { describe, expect, it } from 'vitest';

import type { RootState } from '@/store';
import { makeThread, makeUser } from '@/test/factories';
import {
  fetchThreads,
  selectCategories,
  selectCategory,
  selectFilteredThreads,
  selectThreadsWithOwner,
  threadsReducer,
} from '@/store/slices/threadsSlice';

const users = [makeUser({ id: 'user-1', name: 'Satu' }), makeUser({ id: 'user-2', name: 'Dua' })];
const threads = [
  makeThread({ category: 'Redux', id: 'thread-1', ownerId: 'user-1', title: 'Redux' }),
  makeThread({ category: 'React', id: 'thread-2', ownerId: 'user-2', title: 'React' }),
  makeThread({ category: 'React', id: 'thread-3', ownerId: 'missing', title: 'Missing owner' }),
];

function rootState(selectedCategory = 'all') {
  return {
    auth: { authedUser: null, error: null, status: 'idle', token: null },
    leaderboards: { error: null, items: [], status: 'idle' },
    threadDetail: {
      commentError: null,
      commentStatus: 'idle',
      detail: null,
      error: null,
      notFound: false,
      status: 'idle',
      threadId: null,
    },
    threads: { error: null, selectedCategory, status: 'succeeded', threads, users },
  } as RootState;
}

describe('threadsSlice reducer and selectors', () => {
  it('starts with empty all-category state', () => {
    expect(threadsReducer(undefined, { type: 'unknown' })).toEqual({
      error: null,
      selectedCategory: 'all',
      status: 'idle',
      threads: [],
      users: [],
    });
  });

  it('fetchThreads pending keeps old data and starts loading', () => {
    const state = threadsReducer(
      { error: 'lama', selectedCategory: 'React', status: 'failed', threads, users },
      fetchThreads.pending('request-1', undefined),
    );

    expect(state).toMatchObject({ error: null, status: 'loading', threads, users });
  });

  it('fetchThreads rejected stores readable error', () => {
    const state = threadsReducer(
      undefined,
      fetchThreads.rejected(null, 'request-1', undefined, 'Gagal'),
    );

    expect(state).toMatchObject({ error: 'Gagal', status: 'failed' });
  });

  it('selectCategory stores selected filter', () => {
    expect(threadsReducer(undefined, selectCategory('React')).selectedCategory).toBe('React');
  });

  it('selectThreadsWithOwner falls back to null for missing owner', () => {
    const result = selectThreadsWithOwner(rootState());

    expect(result[0]?.owner?.name).toBe('Satu');
    expect(result[2]?.owner).toBeNull();
  });

  it('selectCategories returns unique sorted categories', () => {
    expect(selectCategories(rootState())).toEqual(['React', 'Redux']);
  });

  it('selectFilteredThreads returns all for all category', () => {
    expect(selectFilteredThreads(rootState())).toHaveLength(3);
  });

  it('selectFilteredThreads returns matching category only', () => {
    expect(selectFilteredThreads(rootState('React')).map((thread) => thread.id)).toEqual([
      'thread-2',
      'thread-3',
    ]);
  });

  it('selectFilteredThreads returns empty array for unknown category', () => {
    expect(selectFilteredThreads(rootState('Vue'))).toEqual([]);
  });
});
