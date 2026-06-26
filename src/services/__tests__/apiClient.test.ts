import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError, apiClient } from '@/services/apiClient';
import { getToken, setToken } from '@/services/tokenStorage';

const createJsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
    ...init,
  });

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

describe('apiClient', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: createLocalStorageMock(),
    });

    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Reflect.deleteProperty(globalThis, 'localStorage');
  });

  it('uses API base URL and parses success data', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse({
        status: 'success',
        message: 'ok',
        data: { value: 'thread' },
      }),
    );

    await expect(apiClient<{ value: string }>('/threads')).resolves.toEqual({
      message: 'Berhasil.',
      value: 'thread',
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://forum-api.dicoding.dev/v1/threads',
      expect.any(Object),
    );
  });

  it('stringifies JSON body and sets content type', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse({ status: 'success', message: 'ok', data: {} }),
    );

    await apiClient('/threads', {
      body: { title: 'Judul', body: 'Isi' },
      method: 'POST',
    });

    const [, init] = vi.mocked(fetch).mock.calls[0];
    const headers = new Headers(init?.headers);

    expect(init?.body).toBe(JSON.stringify({ title: 'Judul', body: 'Isi' }));
    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('injects bearer token when available', async () => {
    setToken('token-123');
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse({ status: 'success', message: 'ok', data: {} }),
    );

    await apiClient('/users/me');

    const [, init] = vi.mocked(fetch).mock.calls[0];
    const headers = new Headers(init?.headers);

    expect(headers.get('Authorization')).toBe('Bearer token-123');
  });

  it('throws API message on failed response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse({ status: 'fail', message: 'Thread tidak ditemukan' }, { status: 404 }),
    );

    await expect(apiClient('/threads/missing')).rejects.toThrow('Thread tidak ditemukan');
  });

  it('removes token and translates unauthorized response', async () => {
    setToken('token-123');
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse({ status: 'fail', message: 'Token invalid' }, { status: 401 }),
    );

    await expect(apiClient('/users/me')).rejects.toMatchObject({
      isUnauthorized: true,
      message: 'Sesi tidak valid.',
      status: 401,
    });
    expect(getToken()).toBeNull();
  });

  it('throws readable message on network error', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(apiClient('/threads')).rejects.toThrow(
      'Tidak dapat terhubung ke server. Periksa koneksi Anda.',
    );
  });

  it('throws typed error on invalid success payload', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      createJsonResponse({ status: 'success', message: 'ok' }),
    );

    await expect(apiClient('/threads')).rejects.toBeInstanceOf(ApiError);
  });
});
