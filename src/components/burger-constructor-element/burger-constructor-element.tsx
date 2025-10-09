import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

import { useDispatch } from '../../services/store';
import {
  moveIngredientUp,
  moveIngredientDown,
  removeIngredient
} from '../../services/slices/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    // вверх/вниз. UI-гард от выхода за границы (редьюсер всё равно должен держать инвариант)
    const handleMoveUp = () => {
      if (index > 0) dispatch(moveIngredientUp(index));
    };

    const handleMoveDown = () => {
      if (index < totalItems - 1) dispatch(moveIngredientDown(index));
    };

    const handleClose = () => {
      // у начинок есть id; у булки — нет, её удаляем только заменой
      if (ingredient.id) {
        dispatch(removeIngredient(ingredient.id));
      }
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
