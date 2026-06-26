import { describe, expect, it, vi } from 'vitest';

import { authReducer, fetchAuthedUser, login, logout, register } from '@/store/slices/authSlice';
import { makeUser } from '@/test/factories';

const user = makeUser();

describe('authSlice reducer states', () => {
  it('uses idle initial state when no token exists', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      authedUser: null,
      error: null,
      status: 'idle',
      token: null,
    });
  });

  it('login pending clears previous error', () => {
    const state = authReducer(
      { authedUser: null, error: 'lama', status: 'failed', token: null },
      login.pending('request-1', { email: 'u@x.com', password: 'secret123' }),
    );

    expect(state.error).toBeNull();
    expect(state.status).toBe('loading');
  });

  it('login rejected clears user and token', () => {
    const state = authReducer(
      { authedUser: user, error: null, status: 'loading', token: 'token' },
      login.rejected(
        null,
        'request-1',
        { email: 'u@x.com', password: 'secret123' },
        'Masuk gagal.',
      ),
    );

    expect(state).toEqual({
      authedUser: null,
      error: 'Masuk gagal.',
      status: 'failed',
      token: null,
    });
  });

  it('fetchAuthedUser pending keeps token while restoring session', () => {
    const state = authReducer(
      { authedUser: null, error: 'lama', status: 'failed', token: 'token' },
      fetchAuthedUser.pending('request-1', undefined),
    );

    expect(state).toMatchObject({ error: null, status: 'loading', token: 'token' });
  });

  it('fetchAuthedUser fulfilled stores current token from storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('token-baru');

    const state = authReducer(
      { authedUser: null, error: 'lama', status: 'loading', token: 'token-lama' },
      fetchAuthedUser.fulfilled(user, 'request-1', undefined),
    );

    expect(state).toEqual({
      authedUser: user,
      error: null,
      status: 'succeeded',
      token: 'token-baru',
    });
  });

  it('register pending and rejected expose registration error', () => {
    const pending = authReducer(
      undefined,
      register.pending('request-1', {
        email: 'u@x.com',
        name: 'User',
        password: 'secret123',
      }),
    );
    const failed = authReducer(
      pending,
      register.rejected(
        null,
        'request-1',
        {
          email: 'u@x.com',
          name: 'User',
          password: 'secret123',
        },
        'Email sudah digunakan.',
      ),
    );

    expect(failed).toMatchObject({ error: 'Email sudah digunakan.', status: 'failed' });
  });

  it('logout removes persisted token', () => {
    const removeItem = vi.spyOn(Storage.prototype, 'removeItem');

    authReducer({ authedUser: user, error: null, status: 'succeeded', token: 'token' }, logout());

    expect(removeItem).toHaveBeenCalledWith('forum_access_token');
  });
});
