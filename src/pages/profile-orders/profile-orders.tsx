import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { ProfileOrdersUI } from '@ui-pages';
import {
  setFeedData,
  setFeedError,
  selectFeedOrders
} from '../../services/slices/feedSlice';
import { getCookie } from '../../utils/cookie';
import { TOrder, TOrdersData } from '@utils-types';

const WS_URL = 'wss://norma.nomoreparties.space/orders';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrders);

  useEffect(() => {
    const accessToken = getCookie('accessToken')?.replace('Bearer ', '');
    const socket = new WebSocket(`${WS_URL}?token=${accessToken}`);

    socket.onopen = () => {
      console.log('ProfileOrders WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data: TOrdersData = JSON.parse(event.data);
      if (data?.orders) {
        dispatch(setFeedData(data));
      }
    };
    socket.onerror = () => {
      dispatch(setFeedError('WebSocket error'));
    };

    socket.onclose = () => {
      console.log('ProfileOrders WebSocket disconnected');
    };

    return () => socket.close();
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
