import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import {
  fetchOrderByNumber,
  selectOrderData,
  selectOrderLoading
} from '../../services/slices/orderSlice';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();

  const orderData = useSelector(selectOrderData);
  const isLoading = useSelector(selectOrderLoading);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    if (!orderData && number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, orderData]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc, item) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          const count = acc[item]?.count ? acc[item].count + 1 : 1;
          acc[item] = { ...ingredient, count };
        }
        return acc;
      },
      {} as Record<string, TIngredient & { count: number }>
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
