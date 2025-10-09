import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '../app-header';
import { ConstructorPage } from '@pages';
import { Modal } from '@components';
import { IngredientDetails } from '@components';
import { Preloader } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import {
  fetchIngredients,
  selectIngredientsLoading,
  selectIngredientsLoadedOnce,
  selectIngredientsError
} from '../../services/slices/ingredientsSlice';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const background = (location.state as { background?: Location })?.background;

  const isLoading = useSelector(selectIngredientsLoading);
  const loadedOnce = useSelector(selectIngredientsLoadedOnce);
  const error = useSelector(selectIngredientsError);

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

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* если есть background — рисуем страницу "под модалкой" */}
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        {/* при необходимости: другие страницы позже */}
      </Routes>

      {/* модалка поверх, если мы пришли со списка и в state лежит background */}
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
        </Routes>
      )}
    </div>
  );
};

export default App;
