import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { ProfileOrdersUI } from '@ui-pages';
import {
  selectFeedOrders,
  selectFeedError
} from '../../services/slices/feedSlice';
import { TOrder } from '@utils-types';

// подключение WebSocket
const WS_URL = `${process.env.BURGER_API_WS_URL}/orders`;

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  // данные из стора
  const orders: TOrder[] = useSelector(selectFeedOrders);
  const error = useSelector(selectFeedError);

  useEffect(() => {
    const accessToken = localStorage
      .getItem('accessToken')
      ?.replace('Bearer ', '');
    const ws = new WebSocket(`${WS_URL}?token=${accessToken}`);

    ws.onopen = () => console.log('ProfileOrders WebSocket connected ');
    ws.onerror = (err) => console.error('WebSocket error ', err);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data?.success) {
        dispatch({
          type: 'feed/setFeedData',
          payload: {
            orders: data.orders,
            total: data.total,
            totalToday: data.totalToday
          }
        });
      }
    };

    ws.onclose = () => console.log('ProfileOrders WebSocket disconnected ');

    return () => ws.close();
  }, [dispatch]);

  if (error) return <div>Ошибка загрузки заказов: {error}</div>;
  return <ProfileOrdersUI orders={orders} />;
};
