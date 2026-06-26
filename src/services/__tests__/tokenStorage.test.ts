import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { getToken, removeToken, setToken } from '@/services/tokenStorage';

const createLocalStorageMock = () => {
  const store = new Map<string, string>();

  return {
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => Array.from(store.keys()).at(index) ?? null,
    removeItem: (key: string) => store.delete(key),
    setItem: (key: string, value: string) => store.set(key, value),
    get length() {
      return store.size;
    },
  } satisfies Storage;
};

describe('tokenStorage', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: createLocalStorageMock(),
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'localStorage');
  });

  it('returns null when token does not exist', () => {
    expect(getToken()).toBeNull();
  });

  it('saves token', () => {
    setToken('token-123');

    expect(globalThis.localStorage.getItem('forum_access_token')).toBe('token-123');
  });

  it('returns saved token', () => {
    setToken('token-123');

    expect(getToken()).toBe('token-123');
  });

  it('overwrites previous token', () => {
    setToken('old-token');
    setToken('new-token');

    expect(getToken()).toBe('new-token');
  });

  it('removes token', () => {
    setToken('token-123');
    removeToken();

    expect(getToken()).toBeNull();
  });

  it('does not remove unrelated localStorage values', () => {
    globalThis.localStorage.setItem('theme', 'dark');
    setToken('token-123');
    removeToken();

    expect(globalThis.localStorage.getItem('theme')).toBe('dark');
  });

  it('handles unavailable localStorage safely', () => {
    Reflect.deleteProperty(globalThis, 'localStorage');

    expect(getToken()).toBeNull();
    expect(() => setToken('token-123')).not.toThrow();
    expect(() => removeToken()).not.toThrow();
  });
});
