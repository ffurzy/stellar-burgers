import { FC } from 'react';
import styles from './app.module.css';
import { Routes, Route } from 'react-router-dom';

import { AppHeader } from '../app-header';
import { ConstructorPage } from '../../pages/constructor-page/constructor-page';

const App: FC = () => (
  <div className={styles.app}>
    <AppHeader />
    <Routes>
      <Route path='/' element={<ConstructorPage />} />
    </Routes>
  </div>
);

export default App;
