import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import {
  fetchFeeds,
  selectFeedOrders,
  selectFeedLoading,
  selectFeedError
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => dispatch(fetchFeeds());

  if (isLoading && orders.length === 0) return <Preloader />;
  if (error)
    return (
      <div className='text text_type_main-default mt-10 ml-10'>
        Ошибка: {error}
      </div>
    );
  if (orders.length === 0)
    return (
      <div className='text text_type_main-default mt-10 ml-10'>Нет заказов</div>
    );

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
