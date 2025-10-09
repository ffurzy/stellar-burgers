import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { TUser } from '../../utils/types';

import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '../../utils/burger-api';

type AuthState = {
  user: TUser | null;
  isLoading: boolean; // любой активный запрос auth
  error: string | null; // последняя ошибка
  isAuthChecked: boolean; // один раз проверили "кто я?" (важно для защищённых роутов)
};

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthChecked: false
};

// Регистрация
export const registerUser = createAsyncThunk<
  TUser,
  { name: string; email: string; password: string }
>('auth/register', async (data) => {
  const res = await registerUserApi(data);
  // API уже кладёт токены; вернём пользователя
  return res.user;
});

// Логин
export const loginUser = createAsyncThunk<
  TUser,
  { email: string; password: string }
>('auth/login', async (data) => {
  const res = await loginUserApi(data);
  return res.user;
});

// Проверить текущего пользователя (по токенам)
export const fetchUser = createAsyncThunk<TUser>('auth/fetchUser', async () => {
  const res = await getUserApi();
  return res.user;
});

// Обновить данные пользователя
export const updateUser = createAsyncThunk<
  TUser,
  Partial<{ name: string; email: string; password: string }>
>('auth/updateUser', async (patch) => {
  const res = await updateUserApi(patch);
  return res.user;
});

// Выход
export const logout = createAsyncThunk<void>('auth/logout', async () => {
  await logoutApi();
  // токены чистятся в burger-api (refresh в localStorage мы там удаляем)
  // если нужно жёстко — можно дополнительно подчистить здесь
  try {
    localStorage.removeItem('refreshToken');
  } catch {}
});

// ---------- Slice ----------
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Иногда удобно иметь явный reset ошибок перед сабмитом форм
    clearAuthError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // helper для pending
    const onPending = (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    };
    // helper для rejected
    const onRejected = (state: AuthState, action: any) => {
      state.isLoading = false;
      state.error = action.error?.message ?? 'Ошибка запроса';
    };

    // register
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

    // login
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

    // fetchUser (первичная проверка сессии)
    builder.addCase(fetchUser.pending, onPending);
    builder.addCase(
      fetchUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      }
    );
    builder.addCase(fetchUser.rejected, (state, action) => {
      // если не авторизованы/токен невалиден — это не «фатал», просто нет пользователя
      onRejected(state, action);
      state.user = null;
      state.isLoading = false;
      state.isAuthChecked = true;
    });

    // updateUser
    builder.addCase(updateUser.pending, onPending);
    builder.addCase(
      updateUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.isLoading = false;
      }
    );
    builder.addCase(updateUser.rejected, onRejected);

    // logout
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

// ---------- Селекторы ----------
export const selectUser = (s: RootState) => s.auth.user;
export const selectAuthLoading = (s: RootState) => s.auth.isLoading;
export const selectAuthError = (s: RootState) => s.auth.error;
export const selectIsAuthChecked = (s: RootState) => s.auth.isAuthChecked;
export const selectIsAuthenticated = (s: RootState) => Boolean(s.auth.user);
