import { vi } from 'vitest';

export function mockFetchJsonOnce(body: unknown, init: ResponseInit = {}) {
  const response = new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
    ...init,
  });

  return vi.mocked(fetch).mockResolvedValueOnce(response);
}

export function mockFetchErrorOnce(error: Error) {
  return vi.mocked(fetch).mockRejectedValueOnce(error);
}
