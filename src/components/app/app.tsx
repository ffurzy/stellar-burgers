import { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '../app-header';
import {
  ConstructorPage,
  Feed,
  Profile,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Modal } from '@components';
import { IngredientDetails, OrderInfo } from '@components';
import { Preloader } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import {
  fetchIngredients,
  selectIngredientsLoading,
  selectIngredientsLoadedOnce,
  selectIngredientsError
} from '../../services/slices/ingredientsSlice';

import {
  fetchUser,
  selectIsAuthChecked,
  selectIsAuthenticated
} from '../../services/slices/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const background = (location.state as { background?: Location })?.background;

  const isLoading = useSelector(selectIngredientsLoading);
  const loadedOnce = useSelector(selectIngredientsLoadedOnce);
  const error = useSelector(selectIngredientsError);

  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuthChecked]);

  useEffect(() => {
    if (!loadedOnce) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, loadedOnce]);

  if (isLoading && !loadedOnce) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  if (error && !loadedOnce) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <div className='pt-20 pl-5'>
          <p className='text text_type_main-default mb-4'>Ошибка: {error}</p>
          <button onClick={() => dispatch(fetchIngredients())}>
            Повторить
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthChecked) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <div className={styles.headerWrap}>
        <AppHeader />
      </div>

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile'
          element={
            isAuthenticated ? <Profile /> : <Navigate to='/login' replace />
          }
        />
        <Route
          path='/profile/orders'
          element={
            isAuthenticated ? (
              <ProfileOrders />
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />

        <Route
          path='/login'
          element={isAuthenticated ? <Navigate to='/' replace /> : <Login />}
        />
        <Route
          path='/register'
          element={isAuthenticated ? <Navigate to='/' replace /> : <Register />}
        />
        <Route
          path='/forgot-password'
          element={
            isAuthenticated ? <Navigate to='/' replace /> : <ForgotPassword />
          }
        />
        <Route
          path='/reset-password'
          element={
            isAuthenticated ? <Navigate to='/' replace /> : <ResetPassword />
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Информация о заказе' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
