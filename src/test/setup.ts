import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();

  if (typeof localStorage !== 'undefined' && 'clear' in localStorage) {
    localStorage.clear();
  }

  if (typeof sessionStorage !== 'undefined' && 'clear' in sessionStorage) {
    sessionStorage.clear();
  }

  vi.restoreAllMocks();
});
