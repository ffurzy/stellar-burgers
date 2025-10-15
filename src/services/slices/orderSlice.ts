import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

type OrderState = {
  orderModalData: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  orderModalData: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredientIds, { rejectWithValue }) => {
  try {
    const res = await orderBurgerApi(ingredientIds);
    return res.order;
  } catch (err: any) {
    return rejectWithValue(err.message ?? 'Ошибка при оформлении заказа');
  }
});

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/fetchOrderByNumber',
  async (number) => {
    const res = await getOrderByNumberApi(number);
    return res.orders[0];
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder(state) {
      state.orderModalData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isLoading = false;
          state.orderModalData = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка при оформлении заказа';
      });
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderModalData = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка при загрузке заказа';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;

export const selectOrderData = (s: RootState) => s.order.orderModalData;
export const selectOrderLoading = (s: RootState) => s.order.isLoading;
export const selectOrderError = (s: RootState) => s.order.error;
export const selectOrderModalData = (s: RootState) => s.order.orderModalData;
