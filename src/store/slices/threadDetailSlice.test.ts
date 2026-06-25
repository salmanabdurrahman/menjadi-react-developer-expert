import { describe, expect, test } from 'vitest';

import type { ThreadDetail } from '@/types/api';
import {
  clearThreadDetail,
  fetchThreadDetail,
  selectThreadDetail,
  selectThreadDetailState,
  submitComment,
  threadDetailReducer,
} from '@/store/slices/threadDetailSlice';

const detail: ThreadDetail = {
  body: 'Isi lengkap thread',
  category: 'React',
  comments: [
    {
      content: 'Komentar awal',
      createdAt: '2024-01-02T00:00:00.000Z',
      downVotesBy: [],
      id: 'comment-1',
      owner: {
        avatar: 'https://example.com/avatar.png',
        email: 'user@example.com',
        id: 'user-1',
        name: 'User Dicoding',
      },
      upVotesBy: [],
    },
  ],
  createdAt: '2024-01-01T00:00:00.000Z',
  downVotesBy: [],
  id: 'thread-1',
  owner: {
    avatar: 'https://example.com/avatar.png',
    email: 'user@example.com',
    id: 'user-1',
    name: 'User Dicoding',
  },
  title: 'Thread pertama',
  upVotesBy: [],
};

const comment = {
  content: 'Komentar baru',
  createdAt: '2024-01-03T00:00:00.000Z',
  downVotesBy: [],
  id: 'comment-2',
  owner: {
    avatar: 'https://example.com/avatar.png',
    email: 'user@example.com',
    id: 'user-1',
    name: 'User Dicoding',
  },
  upVotesBy: [],
};

describe('threadDetailSlice', () => {
  test('clearThreadDetail resets active detail state', () => {
    const state = threadDetailReducer(
      {
        commentError: 'Error komentar',
        commentStatus: 'failed',
        detail,
        error: 'Error thread',
        notFound: true,
        status: 'failed',
        threadId: 'thread-1',
      },
      clearThreadDetail(),
    );

    expect(state).toEqual({
      commentError: null,
      commentStatus: 'idle',
      detail: null,
      error: null,
      notFound: false,
      status: 'idle',
      threadId: null,
    });
  });

  test('fetchThreadDetail fulfilled stores thread detail', () => {
    const state = threadDetailReducer(
      undefined,
      fetchThreadDetail.fulfilled({ detail, threadId: 'thread-1' }, 'request-1', 'thread-1'),
    );

    expect(state.detail).toEqual(detail);
    expect(state.status).toBe('succeeded');
  });

  test('fetchThreadDetail rejected marks not found for 404 payload', () => {
    const state = threadDetailReducer(
      undefined,
      fetchThreadDetail.rejected(null, 'request-1', 'thread-1', {
        message: 'Thread tidak ditemukan',
        status: 404,
      }),
    );

    expect(state.notFound).toBe(true);
    expect(state.error).toBe('Thread tidak ditemukan');
  });

  test('submitComment fulfilled appends comment to detail', () => {
    const state = threadDetailReducer(
      {
        commentError: null,
        commentStatus: 'loading',
        detail,
        error: null,
        notFound: false,
        status: 'succeeded',
        threadId: 'thread-1',
      },
      submitComment.fulfilled({ comment, message: 'ok', threadId: 'thread-1' }, 'request-1', {
        content: 'Komentar baru',
        threadId: 'thread-1',
      }),
    );

    expect(state.detail?.comments[0]).toEqual(comment);
    expect(state.commentStatus).toBe('succeeded');
  });

  test('selectors read thread detail state', () => {
    const state = {
      auth: {
        authedUser: null,
        error: null,
        status: 'idle',
        token: null,
      },
      threadDetail: {
        commentError: null,
        commentStatus: 'idle',
        detail,
        error: null,
        notFound: false,
        status: 'succeeded',
        threadId: 'thread-1',
      },
      threads: {
        error: null,
        selectedCategory: 'all',
        status: 'idle',
        threads: [],
        users: [],
      },
    };

    expect(selectThreadDetailState(state as never)).toEqual(state.threadDetail);
    expect(selectThreadDetail(state as never)).toEqual(detail);
  });
});
