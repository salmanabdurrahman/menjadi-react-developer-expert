const ACCESS_TOKEN_KEY = 'forum_access_token';

function getLocalStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

export function getToken() {
  return getLocalStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null;
}

export function setToken(token: string) {
  getLocalStorage()?.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeToken() {
  getLocalStorage()?.removeItem(ACCESS_TOKEN_KEY);
}
