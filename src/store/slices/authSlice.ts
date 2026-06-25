import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getToken, removeToken, setToken } from '@/services/tokenStorage';
import type { User } from '@/types/api';
import { toIndonesianMessage } from '@/utils/messages';
import { getAuthedUser, loginUser, registerUser } from '@/services/forum/authApi';

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface AuthState {
  authedUser: User | null;
  error: string | null;
  status: AuthStatus;
  token: string | null;
}

const initialState: AuthState = {
  authedUser: null,
  error: null,
  status: 'idle',
  token: getToken(),
};

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? toIndonesianMessage(error.message, 'Autentikasi gagal.')
    : 'Autentikasi gagal.';
}

function getPayloadMessage(payload: unknown, fallback: string) {
  return typeof payload === 'string' ? payload : fallback;
}

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await registerUser(credentials);

      return { message: response.message, user: response.user };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAuthedUser = createAsyncThunk(
  'auth/fetchAuthedUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAuthedUser();

      return response.user;
    } catch (error) {
      removeToken();

      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      setToken(response.token);

      const authedUser = await dispatch(fetchAuthedUser()).unwrap();

      return { authedUser, message: response.message, token: response.token };
    } catch (error) {
      removeToken();

      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.authedUser = null;
      state.error = null;
      state.status = 'idle';
      state.token = null;
      removeToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state) => {
        state.error = null;
        state.status = 'succeeded';
      })
      .addCase(register.rejected, (state, action) => {
        state.error = getPayloadMessage(action.payload, 'Pendaftaran gagal.');
        state.status = 'failed';
      })
      .addCase(login.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authedUser = action.payload.authedUser;
        state.error = null;
        state.status = 'succeeded';
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.authedUser = null;
        state.error = getPayloadMessage(action.payload, 'Masuk gagal.');
        state.status = 'failed';
        state.token = null;
      })
      .addCase(fetchAuthedUser.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchAuthedUser.fulfilled, (state, action) => {
        state.authedUser = action.payload;
        state.error = null;
        state.status = 'succeeded';
        state.token = getToken();
      })
      .addCase(fetchAuthedUser.rejected, (state, action) => {
        state.authedUser = null;
        state.error = getPayloadMessage(action.payload, 'Sesi tidak valid.');
        state.status = 'failed';
        state.token = null;
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
