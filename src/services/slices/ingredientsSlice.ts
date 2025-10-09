import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import type { RootState } from '../store';
import type { TIngredient } from '../../utils/types';

type IngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchAll',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIngredients.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      fetchIngredients.fulfilled,
      (state, action: PayloadAction<TIngredient[]>) => {
        state.items = action.payload;
        state.isLoading = false;
      }
    );
    builder.addCase(fetchIngredients.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? 'Не удалось загрузить ингредиенты';
    });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;

export const selectIngredients = (s: RootState) => s.ingredients.items;
export const selectIngredientsLoading = (s: RootState) =>
  s.ingredients.isLoading;
export const selectIngredientsError = (s: RootState) => s.ingredients.error;
