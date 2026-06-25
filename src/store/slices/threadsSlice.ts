import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import type { Thread, User } from '@/types/api';
import { toIndonesianMessage } from '@/utils/messages';
import { createThread as createThreadApi, getThreads, getUsers } from '@/services/forum/threadsApi';

export type ThreadsStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ThreadWithOwner extends Thread {
  owner: User | null;
}

interface ThreadsState {
  error: string | null;
  selectedCategory: string;
  status: ThreadsStatus;
  threads: Thread[];
  users: User[];
}

const ALL_CATEGORY = 'all';

const initialState: ThreadsState = {
  error: null,
  selectedCategory: ALL_CATEGORY,
  status: 'idle',
  threads: [],
  users: [],
};

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? toIndonesianMessage(error.message, 'Thread gagal dimuat.')
    : 'Thread gagal dimuat.';
}

function getPayloadMessage(payload: unknown, fallback: string) {
  return typeof payload === 'string' ? payload : fallback;
}

export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async (_, { rejectWithValue }) => {
    try {
      const [threadsResponse, usersResponse] = await Promise.all([getThreads(), getUsers()]);

      return {
        threads: threadsResponse.threads,
        users: usersResponse.users,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const submitThread = createAsyncThunk(
  'threads/submitThread',
  async (payload: { body: string; category: string; title: string }, { rejectWithValue }) => {
    try {
      return await createThreadApi(payload);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? toIndonesianMessage(error.message, 'Thread gagal dibuat.')
          : 'Thread gagal dibuat.',
      );
    }
  },
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    selectCategory(state, action: { payload: string }) {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.threads = action.payload.threads;
        state.users = action.payload.users;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.error = getPayloadMessage(action.payload, 'Thread gagal dimuat.');
        state.status = 'failed';
      });
  },
});

export const { selectCategory } = threadsSlice.actions;
export const threadsReducer = threadsSlice.reducer;

export const selectThreadsState = (state: RootState) => state.threads;
export const selectSelectedCategory = (state: RootState) => state.threads.selectedCategory;

export const selectThreadsWithOwner = createSelector([selectThreadsState], ({ threads, users }) => {
  const usersById = new Map(users.map((user) => [user.id, user]));

  return threads.map<ThreadWithOwner>((thread) => ({
    ...thread,
    owner: usersById.get(thread.ownerId) ?? null,
  }));
});

export const selectCategories = createSelector([selectThreadsState], ({ threads }) =>
  Array.from(new Set(threads.map((thread) => thread.category))).sort((a, b) => a.localeCompare(b)),
);

export const selectFilteredThreads = createSelector(
  [selectThreadsWithOwner, selectSelectedCategory],
  (threads, selectedCategory) => {
    if (selectedCategory === ALL_CATEGORY) {
      return threads;
    }

    return threads.filter((thread) => thread.category === selectedCategory);
  },
);
