import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import type { RootState } from '../store';
import type { TOrder } from '../../utils/types';

type FeedState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: FeedState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk<TOrder[]>(
  'feed/fetchAll',
  async () => {
    const data = await getFeedsApi();
    return data.orders;
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.orders = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить ленту';
      });
  }
});

export const feedReducer = feedSlice.reducer;

export const selectFeedOrders = (s: RootState) => s.feed.orders;
export const selectFeedLoading = (s: RootState) => s.feed.isLoading;
export const selectFeedError = (s: RootState) => s.feed.error;
