import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '@/features/auth/authSlice';
import { leaderboardsReducer } from '@/features/leaderboards';
import { threadDetailReducer, threadsReducer } from '@/features/threads';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leaderboards: leaderboardsReducer,
    threadDetail: threadDetailReducer,
    threads: threadsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
