import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/app/store';
import { ApiError } from '@/services/apiClient';
import type { ThreadDetail } from '@/types/api';
import { toIndonesianMessage } from '@/utils/messages';
import { createComment } from '@/features/comments/commentsApi';
import { getThreadDetail } from '@/features/threads/threadsApi';

export type ThreadDetailStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface RequestError {
  message: string;
  status: number;
}

interface ThreadDetailState {
  commentError: string | null;
  commentStatus: ThreadDetailStatus;
  detail: ThreadDetail | null;
  error: string | null;
  notFound: boolean;
  status: ThreadDetailStatus;
  threadId: string | null;
}

const initialState: ThreadDetailState = {
  commentError: null,
  commentStatus: 'idle',
  detail: null,
  error: null,
  notFound: false,
  status: 'idle',
  threadId: null,
};

function getErrorPayload(error: unknown, fallback: string): RequestError {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      status: error.status,
    };
  }

  return {
    message: error instanceof Error ? toIndonesianMessage(error.message, fallback) : fallback,
    status: 0,
  };
}

function normalizeErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === 'object' && payload !== null && 'message' in payload) {
    const value = (payload as RequestError).message;
    return value || fallback;
  }

  if (typeof payload === 'string') {
    return payload;
  }

  return fallback;
}

export const fetchThreadDetail = createAsyncThunk(
  'threadDetail/fetchThreadDetail',
  async (threadId: string, { rejectWithValue }) => {
    try {
      const response = await getThreadDetail(threadId);
      return { detail: response.detailThread, threadId };
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Thread gagal dimuat.'));
    }
  },
);

export const submitComment = createAsyncThunk(
  'threadDetail/submitComment',
  async (payload: { content: string; threadId: string }, { rejectWithValue }) => {
    try {
      const response = await createComment(payload.threadId, {
        content: payload.content,
      });

      return {
        comment: response.comment,
        message: response.message,
        threadId: payload.threadId,
      };
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Komentar gagal dikirim.'));
    }
  },
);

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState,
  reducers: {
    clearThreadDetail(state) {
      state.commentError = null;
      state.commentStatus = 'idle';
      state.detail = null;
      state.error = null;
      state.notFound = false;
      state.status = 'idle';
      state.threadId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadDetail.pending, (state, action) => {
        state.error = null;
        state.notFound = false;
        state.status = 'loading';
        state.threadId = action.meta.arg;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.detail = action.payload.detail;
        state.error = null;
        state.notFound = false;
        state.status = 'succeeded';
        state.threadId = action.payload.threadId;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        const payload = action.payload as RequestError | undefined;
        state.detail = null;
        state.error = normalizeErrorMessage(payload, 'Thread gagal dimuat.');
        state.notFound = payload?.status === 404;
        state.status = 'failed';
      })
      .addCase(submitComment.pending, (state) => {
        state.commentError = null;
        state.commentStatus = 'loading';
      })
      .addCase(submitComment.fulfilled, (state, action) => {
        state.commentError = null;
        state.commentStatus = 'succeeded';
        if (state.detail?.id === action.payload.threadId) {
          state.detail.comments = [action.payload.comment, ...state.detail.comments];
        }
      })
      .addCase(submitComment.rejected, (state, action) => {
        const payload = action.payload as RequestError | undefined;
        state.commentError = normalizeErrorMessage(payload, 'Komentar gagal dikirim.');
        state.commentStatus = 'failed';
      });
  },
});

export const { clearThreadDetail } = threadDetailSlice.actions;
export const threadDetailReducer = threadDetailSlice.reducer;

export const selectThreadDetailState = (state: RootState) => state.threadDetail;
export const selectThreadDetail = (state: RootState) => state.threadDetail.detail;
