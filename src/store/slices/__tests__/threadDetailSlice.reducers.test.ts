import { describe, expect, it } from 'vitest';

import { makeComment, makeThreadDetail } from '@/test/factories';
import {
  clearThreadDetail,
  fetchThreadDetail,
  submitComment,
  threadDetailReducer,
} from '@/store/slices/threadDetailSlice';

const detail = makeThreadDetail({ id: 'thread-1', comments: [makeComment({ id: 'comment-1' })] });
const comment = makeComment({ id: 'comment-2', content: 'Komentar baru' });

describe('threadDetailSlice reducer states', () => {
  it('starts with empty detail state', () => {
    expect(threadDetailReducer(undefined, { type: 'unknown' })).toEqual({
      commentError: null,
      commentStatus: 'idle',
      detail: null,
      error: null,
      notFound: false,
      status: 'idle',
      threadId: null,
    });
  });

  it('fetchThreadDetail pending records active thread id', () => {
    const state = threadDetailReducer(
      {
        commentError: null,
        commentStatus: 'idle',
        detail,
        error: 'lama',
        notFound: true,
        status: 'failed',
        threadId: null,
      },
      fetchThreadDetail.pending('request-1', 'thread-2'),
    );

    expect(state).toMatchObject({
      error: null,
      notFound: false,
      status: 'loading',
      threadId: 'thread-2',
    });
  });

  it('fetchThreadDetail fulfilled replaces stale detail', () => {
    const nextDetail = makeThreadDetail({ id: 'thread-2' });
    const state = threadDetailReducer(
      {
        commentError: null,
        commentStatus: 'idle',
        detail,
        error: null,
        notFound: false,
        status: 'loading',
        threadId: 'thread-1',
      },
      fetchThreadDetail.fulfilled(
        { detail: nextDetail, threadId: 'thread-2' },
        'request-1',
        'thread-2',
      ),
    );

    expect(state.detail?.id).toBe('thread-2');
    expect(state.status).toBe('succeeded');
  });

  it('fetchThreadDetail rejected clears detail and marks generic failure', () => {
    const state = threadDetailReducer(
      {
        commentError: null,
        commentStatus: 'idle',
        detail,
        error: null,
        notFound: false,
        status: 'loading',
        threadId: 'thread-1',
      },
      fetchThreadDetail.rejected(null, 'request-1', 'thread-1', { message: 'Gagal', status: 500 }),
    );

    expect(state.detail).toBeNull();
    expect(state.error).toBe('Gagal');
    expect(state.notFound).toBe(false);
    expect(state.status).toBe('failed');
  });

  it('submitComment pending clears previous comment error', () => {
    const state = threadDetailReducer(
      {
        commentError: 'lama',
        commentStatus: 'failed',
        detail,
        error: null,
        notFound: false,
        status: 'succeeded',
        threadId: 'thread-1',
      },
      submitComment.pending('request-1', { content: 'Baru', threadId: 'thread-1' }),
    );

    expect(state.commentError).toBeNull();
    expect(state.commentStatus).toBe('loading');
  });

  it('submitComment fulfilled prepends comment for matching thread', () => {
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
        content: 'Baru',
        threadId: 'thread-1',
      }),
    );

    expect(state.detail?.comments.map((item) => item.id)).toEqual(['comment-2', 'comment-1']);
    expect(state.commentStatus).toBe('succeeded');
  });

  it('submitComment fulfilled ignores stale thread response', () => {
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
      submitComment.fulfilled({ comment, message: 'ok', threadId: 'thread-2' }, 'request-1', {
        content: 'Baru',
        threadId: 'thread-2',
      }),
    );

    expect(state.detail?.comments).toHaveLength(1);
  });

  it('submitComment rejected stores comment error only', () => {
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
      submitComment.rejected(
        null,
        'request-1',
        { content: 'Baru', threadId: 'thread-1' },
        { message: 'Unauthorized', status: 401 },
      ),
    );

    expect(state.commentError).toBe('Unauthorized');
    expect(state.commentStatus).toBe('failed');
    expect(state.detail).toEqual(detail);
  });

  it('clearThreadDetail resets detail and comment state', () => {
    const state = threadDetailReducer(
      {
        commentError: 'err',
        commentStatus: 'failed',
        detail,
        error: 'err',
        notFound: true,
        status: 'failed',
        threadId: 'thread-1',
      },
      clearThreadDetail(),
    );

    expect(state.detail).toBeNull();
    expect(state.commentStatus).toBe('idle');
    expect(state.status).toBe('idle');
  });
});
