import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import type { LeaderboardItem } from '@/types/api';
import { toIndonesianMessage } from '@/utils/messages';
import { getLeaderboards } from '@/services/forum/leaderboardsApi';

export type LeaderboardsStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface LeaderboardState {
  error: string | null;
  items: LeaderboardItem[];
  status: LeaderboardsStatus;
}

const initialState: LeaderboardState = {
  error: null,
  items: [],
  status: 'idle',
};

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? toIndonesianMessage(error.message, 'Papan peringkat gagal dimuat.')
    : 'Papan peringkat gagal dimuat.';
}

function getPayloadMessage(payload: unknown, fallback: string) {
  return typeof payload === 'string' ? payload : fallback;
}

export const fetchLeaderboards = createAsyncThunk(
  'leaderboards/fetchLeaderboards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getLeaderboards();

      return response.leaderboards;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboards.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchLeaderboards.fulfilled, (state, action) => {
        state.error = null;
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchLeaderboards.rejected, (state, action) => {
        state.error = getPayloadMessage(action.payload, 'Papan peringkat gagal dimuat.');
        state.status = 'failed';
      });
  },
});

export const leaderboardsReducer = leaderboardsSlice.reducer;
export const selectLeaderboardsState = (state: RootState) => state.leaderboards;
