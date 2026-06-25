import { describe, expect, test, vi } from 'vitest';

import { authReducer, fetchAuthedUser, login, logout, register } from '@/features/auth/authSlice';

function createLocalStorageMock(initialValue?: string) {
  const store = new Map<string, string>();

  if (initialValue !== undefined) {
    store.set('forum_access_token', initialValue);
  }

  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
  };
}

const authedUser = {
  avatar: 'https://example.com/avatar.png',
  email: 'user@example.com',
  id: 'user-1',
  name: 'User Dicoding',
};

describe('authSlice', () => {
  test('logout clears auth state and stored token', () => {
    const localStorageMock = createLocalStorageMock('token-123');
    vi.stubGlobal('localStorage', localStorageMock);

    const state = authReducer(
      {
        authedUser,
        error: 'Error lama',
        status: 'failed',
        token: 'token-123',
      },
      logout(),
    );

    expect(state).toEqual({
      authedUser: null,
      error: null,
      status: 'idle',
      token: null,
    });
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('forum_access_token');
  });

  test('register fulfilled clears loading state without logging user in', () => {
    const state = authReducer(
      {
        authedUser: null,
        error: null,
        status: 'loading',
        token: null,
      },
      register.fulfilled({ message: 'ok', user: authedUser }, 'request-1', {
        email: 'user@example.com',
        name: 'User Dicoding',
        password: 'secret123',
      }),
    );

    expect(state).toEqual({
      authedUser: null,
      error: null,
      status: 'succeeded',
      token: null,
    });
  });

  test('login fulfilled stores token and authenticated user in state', () => {
    const state = authReducer(
      {
        authedUser: null,
        error: null,
        status: 'loading',
        token: null,
      },
      login.fulfilled({ authedUser, message: 'ok', token: 'token-123' }, 'request-1', {
        email: 'user@example.com',
        password: 'secret123',
      }),
    );

    expect(state).toEqual({
      authedUser,
      error: null,
      status: 'succeeded',
      token: 'token-123',
    });
  });

  test('fetchAuthedUser rejected clears invalid session state', () => {
    const state = authReducer(
      {
        authedUser: null,
        error: null,
        status: 'loading',
        token: 'token-123',
      },
      fetchAuthedUser.rejected(null, 'request-1', undefined, 'Sesi tidak valid.'),
    );

    expect(state).toEqual({
      authedUser: null,
      error: 'Sesi tidak valid.',
      status: 'failed',
      token: null,
    });
  });
});
