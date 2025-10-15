import { FC, memo, useCallback } from 'react';
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
    const handleMove = useCallback(
      (direction: 'up' | 'down') => {
        if (direction === 'up' && index > 0) dispatch(moveIngredientUp(index));
        if (direction === 'down' && index < totalItems - 1)
          dispatch(moveIngredientDown(index));
      },
      [dispatch, index, totalItems]
    );
    const handleClose = useCallback(() => {
      if (ingredient.id) dispatch(removeIngredient(ingredient.id));
    }, [dispatch, ingredient.id]);

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={() => handleMove('up')}
        handleMoveDown={() => handleMove('down')}
        handleClose={handleClose}
      />
    );
  }
);
