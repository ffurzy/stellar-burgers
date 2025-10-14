import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useSelector, useDispatch } from '../../services/store';
import {
  selectUser,
  selectIsAuthChecked,
  selectAuthLoading,
  selectAuthError,
  updateUser
} from '../../services/slices/authSlice';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAuthLoading);
  const errorText = useSelector(selectAuthError);

  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  useEffect(() => {
    if (isAuthChecked && !user) {
      navigate('/login', { replace: true, state: { from: location } });
    }
  }, [isAuthChecked, user, navigate, location]);

  if (!isAuthChecked) return null;
  if (!user) return null;

  const [formValue, setFormValue] = useState({
    name: user.name ?? '',
    email: user.email ?? '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUser(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
