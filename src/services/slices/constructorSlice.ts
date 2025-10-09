import {
  createSlice,
  nanoid,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { TIngredient, TConstructorIngredient } from '@utils-types';

type ConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // добавляем ингредиент в конструктор
    addIngredient(state, action: PayloadAction<TIngredient>) {
      const ing = action.payload;
      if (ing.type === 'bun') {
        state.bun = ing; // булка всегда одна (сверху+снизу)
      } else {
        state.ingredients.push({ ...ing, id: nanoid() });
      }
    },

    // удалить начинку по id (булку удалить нельзя — только заменить другой булкой)
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (i) => i.id !== action.payload
      );
    },

    // перестановки в списке начинок
    moveIngredientUp(state, action: PayloadAction<number>) {
      const i = action.payload;
      if (i <= 0 || i >= state.ingredients.length) return;
      [state.ingredients[i - 1], state.ingredients[i]] = [
        state.ingredients[i],
        state.ingredients[i - 1]
      ];
    },
    moveIngredientDown(state, action: PayloadAction<number>) {
      const i = action.payload;
      if (i < 0 || i >= state.ingredients.length - 1) return;
      [state.ingredients[i + 1], state.ingredients[i]] = [
        state.ingredients[i],
        state.ingredients[i + 1]
      ];
    },

    // очистить конструктор (при успешном заказе пригодится)
    resetConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetConstructor
} = constructorSlice.actions;

export const constructorSliceReducer = constructorSlice.reducer;

export const selectConstructor = (s: RootState) => s.burgerConstructor; // { bun, ingredients }

export const selectTotalPrice = createSelector(selectConstructor, (c) => {
  const bun = c.bun ? c.bun.price * 2 : 0;
  const fillings = c.ingredients.reduce((sum, v) => sum + v.price, 0);
  return bun + fillings;
});

export const selectCounters = createSelector(selectConstructor, (c) => {
  const map: Record<string, number> = {};
  if (c.bun) map[c.bun._id] = 2;
  c.ingredients.forEach((i) => (map[i._id] = (map[i._id] ?? 0) + 1));
  return map;
});
