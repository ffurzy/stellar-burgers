import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { ProfileOrdersUI } from '@ui-pages';
import {
  selectProfileOrders,
  selectProfileOrdersLoading,
  selectProfileOrdersError,
  fetchProfileOrders
} from '../../services/slices/profileOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileOrdersLoading);
  const error = useSelector(selectProfileOrdersError);

  useEffect(() => {
    dispatch(fetchProfileOrders()); // подгружаем заказы через API
  }, [dispatch]);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки заказов: {error}</div>;

  return <ProfileOrdersUI orders={orders} />;
};
