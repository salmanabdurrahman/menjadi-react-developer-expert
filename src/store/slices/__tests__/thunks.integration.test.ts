import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authReducer, fetchAuthedUser, login, register } from '@/store/slices/authSlice';
import { leaderboardsReducer, fetchLeaderboards } from '@/store/slices/leaderboardsSlice';
import {
  threadDetailReducer,
  fetchThreadDetail,
  submitComment,
} from '@/store/slices/threadDetailSlice';
import { threadsReducer, fetchThreads, submitThread } from '@/store/slices/threadsSlice';
import {
  makeComment,
  makeLeaderboardItem,
  makeThread,
  makeThreadDetail,
  makeUser,
} from '@/test/factories';
import { mockFetchJsonOnce } from '@/test/mockFetch';

function createStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      leaderboards: leaderboardsReducer,
      threadDetail: threadDetailReducer,
      threads: threadsReducer,
    },
  });
}

function success(data: unknown, message = 'ok') {
  return { data, message, status: 'success' };
}

function fail(message = 'Gagal', status = 400) {
  return mockFetchJsonOnce({ message, status: 'fail' }, { status });
}

describe('async thunk integration', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('register stores success state when API succeeds', async () => {
    const store = createStore();
    mockFetchJsonOnce(success({ user: makeUser() }, 'Pendaftaran berhasil'));

    const result = await store.dispatch(
      register({ email: 'user@example.com', name: 'User', password: 'secret123' }),
    );

    expect(register.fulfilled.match(result)).toBe(true);
    expect(store.getState().auth.status).toBe('succeeded');
    expect(store.getState().auth.authedUser).toBeNull();
  });

  it('register stores readable error when API fails', async () => {
    const store = createStore();
    fail('email is already taken');

    const result = await store.dispatch(
      register({ email: 'user@example.com', name: 'User', password: 'secret123' }),
    );

    expect(register.rejected.match(result)).toBe(true);
    expect(store.getState().auth.status).toBe('failed');
    expect(store.getState().auth.error).toBe('Email sudah digunakan.');
  });

  it('login stores token and user after login + fetch me succeed', async () => {
    const store = createStore();
    const user = makeUser({ id: 'user-login', name: 'User Login' });
    mockFetchJsonOnce(success({ token: 'token-123' }, 'Masuk berhasil'));
    mockFetchJsonOnce(success({ user }, 'User ditemukan'));

    const result = await store.dispatch(
      login({ email: 'user@example.com', password: 'secret123' }),
    );

    expect(login.fulfilled.match(result)).toBe(true);
    expect(store.getState().auth).toMatchObject({
      authedUser: user,
      status: 'succeeded',
      token: 'token-123',
    });
  });

  it('login clears token when fetch user after login fails', async () => {
    const store = createStore();
    mockFetchJsonOnce(success({ token: 'token-123' }, 'Masuk berhasil'));
    fail('Token tidak valid', 401);

    const result = await store.dispatch(
      login({ email: 'user@example.com', password: 'secret123' }),
    );

    expect(login.rejected.match(result)).toBe(true);
    expect(store.getState().auth).toMatchObject({
      authedUser: null,
      status: 'failed',
      token: null,
    });
    expect(localStorage.getItem('forum_access_token')).toBeNull();
  });

  it('fetchAuthedUser restores valid session and removes invalid session', async () => {
    const store = createStore();
    localStorage.setItem('forum_access_token', 'token-123');
    const user = makeUser();
    mockFetchJsonOnce(success({ user }));

    await store.dispatch(fetchAuthedUser());
    expect(store.getState().auth.authedUser).toEqual(user);

    fail('Token tidak valid', 401);
    await store.dispatch(fetchAuthedUser());
    expect(store.getState().auth.token).toBeNull();
    expect(localStorage.getItem('forum_access_token')).toBeNull();
  });

  it('fetchThreads handles threads success and users failure', async () => {
    const successStore = createStore();
    mockFetchJsonOnce(success({ threads: [makeThread()] }));
    mockFetchJsonOnce(success({ users: [makeUser()] }));

    await successStore.dispatch(fetchThreads());
    expect(successStore.getState().threads).toMatchObject({
      status: 'succeeded',
      threads: [makeThread()],
      users: [makeUser()],
    });

    const failedStore = createStore();
    mockFetchJsonOnce(success({ threads: [makeThread()] }));
    fail('users gagal dimuat');

    await failedStore.dispatch(fetchThreads());
    expect(failedStore.getState().threads).toMatchObject({
      status: 'failed',
      error: 'users gagal dimuat',
    });
  });

  it('submitThread succeeds and fails without mutating existing list state', async () => {
    const store = createStore();
    const thread = makeThread({ id: 'thread-new' });
    mockFetchJsonOnce(success({ thread }));

    const ok = await store.dispatch(
      submitThread({ body: 'Isi', category: 'React', title: 'Judul' }),
    );
    expect(submitThread.fulfilled.match(ok)).toBe(true);
    expect(ok.payload).toMatchObject({ thread });

    fail('Thread gagal dibuat');
    const failed = await store.dispatch(submitThread({ body: '', category: 'React', title: '' }));
    expect(submitThread.rejected.match(failed)).toBe(true);
  });

  it('fetchThreadDetail handles success, not found, and loading state', async () => {
    const store = createStore();
    let resolveFetch!: (response: Response) => void;
    vi.mocked(fetch).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );

    const promise = store.dispatch(fetchThreadDetail('thread-1'));
    expect(store.getState().threadDetail).toMatchObject({
      status: 'loading',
      threadId: 'thread-1',
    });

    resolveFetch(
      new Response(JSON.stringify(success({ detailThread: makeThreadDetail() })), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }),
    );
    await promise;
    expect(store.getState().threadDetail.status).toBe('succeeded');

    fail('Thread tidak ditemukan', 404);
    await store.dispatch(fetchThreadDetail('missing'));
    expect(store.getState().threadDetail).toMatchObject({ notFound: true, status: 'failed' });
  });

  it('submitComment prepends comment on success and stores unauthorized error on failure', async () => {
    const store = createStore();
    mockFetchJsonOnce(success({ detailThread: makeThreadDetail({ comments: [] }) }));
    await store.dispatch(fetchThreadDetail('thread-1'));

    const comment = makeComment({ id: 'comment-new' });
    mockFetchJsonOnce(success({ comment }, 'Komentar berhasil'));
    await store.dispatch(submitComment({ content: 'Komentar baru', threadId: 'thread-1' }));
    expect(store.getState().threadDetail.detail?.comments[0]).toEqual(comment);

    fail('Token tidak valid', 401);
    await store.dispatch(submitComment({ content: 'Komentar gagal', threadId: 'thread-1' }));
    expect(store.getState().threadDetail).toMatchObject({
      commentError: 'Token tidak valid',
      commentStatus: 'failed',
    });
  });

  it('fetchLeaderboards handles success, empty result, and failure', async () => {
    const store = createStore();
    const item = makeLeaderboardItem();
    mockFetchJsonOnce(success({ leaderboards: [item] }));
    await store.dispatch(fetchLeaderboards());
    expect(store.getState().leaderboards).toMatchObject({ items: [item], status: 'succeeded' });

    mockFetchJsonOnce(success({ leaderboards: [] }));
    await store.dispatch(fetchLeaderboards());
    expect(store.getState().leaderboards.items).toEqual([]);

    fail('Leaderboard gagal');
    await store.dispatch(fetchLeaderboards());
    expect(store.getState().leaderboards).toMatchObject({
      error: 'Leaderboard gagal',
      status: 'failed',
    });
  });
});
