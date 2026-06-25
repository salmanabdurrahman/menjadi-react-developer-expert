import { API_BASE_URL } from '@/config/env';
import type { ApiResponse } from '@/types/api';
import { toIndonesianMessage } from '@/utils/messages';
import { getToken, removeToken } from '@/services/tokenStorage';

export type ApiResult<T> = T & { message: string };

type RequestOptions = Omit<RequestInit, 'body' | 'headers'> & {
  body?: unknown;
  headers?: HeadersInit;
};

export class ApiError extends Error {
  status: number;

  isUnauthorized: boolean;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isUnauthorized = status === 401;
  }
}

function buildUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function buildHeaders(headers?: HeadersInit) {
  const token = getToken();
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  return requestHeaders;
}

async function parseResponse<T>(response: Response): Promise<ApiResult<T>> {
  let payload: Partial<ApiResponse<T>> | undefined;

  try {
    payload = (await response.json()) as Partial<ApiResponse<T>>;
  } catch {
    payload = undefined;
  }

  if (!response.ok || payload?.status === 'fail') {
    const message = toIndonesianMessage(
      payload?.message ?? 'Permintaan gagal diproses.',
      'Permintaan gagal diproses.',
    );

    if (response.status === 401) {
      removeToken();
    }

    throw new ApiError(message, response.status);
  }

  if (payload?.status !== 'success' || payload.data === undefined) {
    throw new ApiError('Respons API tidak valid.', response.status);
  }

  return {
    ...(payload.data as T & object),
    message: toIndonesianMessage(
      payload.message ?? 'Permintaan berhasil diproses.',
      'Permintaan berhasil diproses.',
    ),
  };
}

export async function apiClient<T>(path: string, options: RequestOptions = {}) {
  const { body, headers, ...init } = options;

  try {
    const response = await fetch(buildUrl(path), {
      ...init,
      body: body === undefined ? undefined : JSON.stringify(body),
      headers: buildHeaders(headers),
    });

    return await parseResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi Anda.', 0);
  }
}
