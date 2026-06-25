import { describe, expect, it, vi, type MockedFunction } from 'vitest';

import { getAuthedUser, loginUser, registerUser } from '@/services/forum/authApi';

vi.mock('@/services/apiClient', () => ({
  apiClient: vi.fn(),
}));

describe('authApi', () => {
  it('registerUser calls register endpoint with payload', async () => {
    const { apiClient } = await import('@/services/apiClient');
    const mockedApiClient = apiClient as MockedFunction<typeof apiClient>;
    mockedApiClient.mockResolvedValueOnce({ message: 'ok', user: {} } as never);

    await registerUser({
      email: 'budi@example.com',
      name: 'Budi',
      password: 'secret123',
    });

    expect(mockedApiClient).toHaveBeenCalledWith('/register', {
      body: {
        email: 'budi@example.com',
        name: 'Budi',
        password: 'secret123',
      },
      method: 'POST',
    });
  });

  it('loginUser calls login endpoint with payload', async () => {
    const { apiClient } = await import('@/services/apiClient');
    const mockedApiClient = apiClient as MockedFunction<typeof apiClient>;
    mockedApiClient.mockResolvedValueOnce({
      message: 'ok',
      token: 'token-123',
    } as never);

    await loginUser({
      email: 'budi@example.com',
      password: 'secret123',
    });

    expect(mockedApiClient).toHaveBeenCalledWith('/login', {
      body: {
        email: 'budi@example.com',
        password: 'secret123',
      },
      method: 'POST',
    });
  });

  it('getAuthedUser calls current user endpoint', async () => {
    const { apiClient } = await import('@/services/apiClient');
    const mockedApiClient = apiClient as MockedFunction<typeof apiClient>;
    mockedApiClient.mockResolvedValueOnce({ message: 'ok', user: {} } as never);

    await getAuthedUser();

    expect(mockedApiClient).toHaveBeenCalledWith('/users/me');
  });
});
