import type { PropsWithChildren, ReactElement } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, type RenderOptions } from '@testing-library/react';

import { authReducer } from '@/store/slices/authSlice';
import { leaderboardsReducer } from '@/store/slices/leaderboardsSlice';
import { threadDetailReducer } from '@/store/slices/threadDetailSlice';
import { threadsReducer } from '@/store/slices/threadsSlice';
import type { RootState } from '@/store';

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  preloadedState?: RootState;
}

export function createTestStore(preloadedState?: RootState) {
  return configureStore({
    preloadedState,
    reducer: {
      auth: authReducer,
      leaderboards: leaderboardsReducer,
      threadDetail: threadDetailReducer,
      threads: threadsReducer,
    },
  });
}

export function renderWithProviders(
  ui: ReactElement,
  { initialEntries = ['/'], preloadedState, ...renderOptions }: RenderWithProvidersOptions = {},
) {
  const testStore = createTestStore(preloadedState);

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={testStore}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return {
    store: testStore,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
