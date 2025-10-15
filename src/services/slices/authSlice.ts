import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { TUser } from '../../utils/types';
import { setCookie, deleteCookie } from '../../utils/cookie';

import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '../../utils/burger-api';

type AuthState = {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthChecked: boolean;
};

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthChecked: false
};

export const registerUser = createAsyncThunk<
  TUser,
  { name: string; email: string; password: string }
>('auth/register', async (data) => {
  const res = await registerUserApi(data);
  setCookie('accessToken', res.accessToken);
  localStorage.setItem('refreshToken', res.refreshToken);
  return res.user;
});

export const loginUser = createAsyncThunk<
  TUser,
  { email: string; password: string }
>('auth/login', async (data) => {
  const res = await loginUserApi(data);
  setCookie('accessToken', res.accessToken);
  localStorage.setItem('refreshToken', res.refreshToken);
  return res.user;
});

export const fetchUser = createAsyncThunk<TUser>('auth/fetchUser', async () => {
  const res = await getUserApi();
  return res.user;
});

export const updateUser = createAsyncThunk<
  TUser,
  Partial<{ name: string; email: string; password: string }>
>('auth/updateUser', async (patch) => {
  const res = await updateUserApi(patch);
  return res.user;
});

export const logout = createAsyncThunk<void>('auth/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    const onPending = (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    };

    const onRejected = (state: AuthState, action: any) => {
      state.isLoading = false;
      state.error = action.error?.message ?? 'Ошибка запроса';
    };

    builder.addCase(registerUser.pending, onPending);
    builder.addCase(
      registerUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      }
    );
    builder.addCase(registerUser.rejected, (state, action) => {
      onRejected(state, action);
      state.isAuthChecked = true;
    });

    builder.addCase(loginUser.pending, onPending);
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      }
    );
    builder.addCase(loginUser.rejected, (state, action) => {
      onRejected(state, action);
      state.isAuthChecked = true;
    });

    builder.addCase(fetchUser.pending, onPending);
    builder.addCase(
      fetchUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      }
    );
    builder.addCase(fetchUser.rejected, (state) => {
      state.user = null;
      state.isLoading = false;
      state.isAuthChecked = true;
    });

    builder.addCase(updateUser.pending, onPending);
    builder.addCase(
      updateUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isLoading = false;
      }
    );
    builder.addCase(updateUser.rejected, onRejected);

    builder.addCase(logout.pending, onPending);
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isLoading = false;
      state.isAuthChecked = true;
    });
    builder.addCase(logout.rejected, onRejected);
  }
});

export const { clearAuthError } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectUser = (s: RootState) => s.auth.user;
export const selectAuthLoading = (s: RootState) => s.auth.isLoading;
export const selectAuthError = (s: RootState) => s.auth.error;
export const selectIsAuthChecked = (s: RootState) => s.auth.isAuthChecked;
export const selectIsAuthenticated = (s: RootState) => Boolean(s.auth.user);
