import { FC, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import {
  clearConstructor,
  selectConstructorBun,
  selectConstructorIngredients
} from '../../services/slices/constructorSlice';
import { selectUser } from '../../services/slices/authSlice';
import { clearOrder, createOrder } from '../../services/slices/orderSlice';
import { useDispatch, useSelector } from '../../services/store';
import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bun = useSelector(selectConstructorBun);
  const ingredients = useSelector(
    selectConstructorIngredients
  ) as TConstructorIngredient[];
  const user = useSelector(selectUser);
  const { isLoading: orderRequest, orderModalData } = useSelector(
    (state) => state.order
  );

  const handleCloseOrderModal = () => {
    dispatch(clearOrder());
  };

  const handleOrderClick = async () => {
    if (!bun || ingredients.length === 0 || orderRequest) return;
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }
    try {
      const ingredientIds = [
        bun._id,
        ...ingredients.map((item) => item._id),
        bun._id
      ];
      const result = await dispatch(createOrder(ingredientIds)).unwrap();
      if (result) {
        dispatch(clearConstructor());
      }
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
    }
  };

  useEffect(
    () => () => {
      dispatch(clearOrder());
    },
    [dispatch]
  );

  const price = useMemo(
    () =>
      (bun?.price || 0) * 2 +
      ingredients.reduce((sum, item) => sum + item.price, 0),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      closeOrderModal={handleCloseOrderModal}
      onOrderClick={handleOrderClick}
    />
  );
};
