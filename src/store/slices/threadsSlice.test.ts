import { describe, expect, test } from 'vitest';

import type { RootState } from '@/store';
import type { Thread, User } from '@/types/api';
import {
  fetchThreads,
  selectCategories,
  selectCategory,
  selectFilteredThreads,
  selectThreadsWithOwner,
  threadsReducer,
} from '@/store/slices/threadsSlice';

const users: User[] = [
  {
    avatar: 'https://example.com/dicoding.png',
    email: 'dicoding@example.com',
    id: 'user-1',
    name: 'Dicoding',
  },
  {
    avatar: 'https://example.com/react.png',
    email: 'react@example.com',
    id: 'user-2',
    name: 'React Dev',
  },
];

const threads: Thread[] = [
  {
    body: 'Body pertama',
    category: 'React',
    createdAt: '2024-01-01T00:00:00.000Z',
    downVotesBy: [],
    id: 'thread-1',
    ownerId: 'user-1',
    title: 'Thread React',
    totalComments: 2,
    upVotesBy: ['user-2'],
  },
  {
    body: 'Body kedua',
    category: 'Redux',
    createdAt: '2024-01-02T00:00:00.000Z',
    downVotesBy: [],
    id: 'thread-2',
    ownerId: 'user-2',
    title: 'Thread Redux',
    totalComments: 0,
    upVotesBy: [],
  },
];

function createRootState(selectedCategory = 'all') {
  return {
    auth: {
      authedUser: null,
      error: null,
      status: 'idle',
      token: null,
    },
    threads: {
      error: null,
      selectedCategory,
      status: 'succeeded',
      threads,
      users,
    },
  } as RootState;
}

describe('threadsSlice', () => {
  test('fetchThreads fulfilled stores threads and users', () => {
    const state = threadsReducer(
      undefined,
      fetchThreads.fulfilled({ threads, users }, 'request-1'),
    );

    expect(state).toMatchObject({
      error: null,
      status: 'succeeded',
      threads,
      users,
    });
  });

  test('selectCategory updates selected category', () => {
    const state = threadsReducer(undefined, selectCategory('React'));

    expect(state.selectedCategory).toBe('React');
  });

  test('selectThreadsWithOwner merges owner by ownerId', () => {
    const result = selectThreadsWithOwner(createRootState());

    expect(result[0]?.owner).toEqual(users[0]);
    expect(result[1]?.owner).toEqual(users[1]);
  });

  test('selectCategories returns unique sorted categories', () => {
    expect(selectCategories(createRootState())).toEqual(['React', 'Redux']);
  });

  test('selectFilteredThreads returns all threads when category is all', () => {
    expect(selectFilteredThreads(createRootState())).toHaveLength(2);
  });

  test('selectFilteredThreads filters by selected category', () => {
    const result = selectFilteredThreads(createRootState('Redux'));

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('thread-2');
  });
});
