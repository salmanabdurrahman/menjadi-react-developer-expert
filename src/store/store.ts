import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '@/store/slices/authSlice';
import { leaderboardsReducer } from '@/store/slices/leaderboardsSlice';
import { threadDetailReducer } from '@/store/slices/threadDetailSlice';
import { threadsReducer } from '@/store/slices/threadsSlice';

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
