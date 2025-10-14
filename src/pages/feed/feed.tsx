import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { FeedUI } from '@ui-pages';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { Preloader } from '@ui';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const { orders, isLoading, error } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (isLoading && !orders.length) return <Preloader />;
  if (error) return <div>Ошибка: {error}</div>;
  if (!orders.length) return <div>Нет доступных заказов</div>;

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
