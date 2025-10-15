import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIngredientById,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id = '' } = useParams<{ id: string }>();

  const isLoading = useSelector(selectIngredientsLoading);
  const ingredient = useSelector(selectIngredientById(id));

  if (isLoading && !ingredient) {
    return <Preloader />;
  }
  if (!ingredient) {
    return (
      <p className='text text_type_main-default mt-20 ml-10'>
        Ингредиент не найден
      </p>
    );
  }
  return <IngredientDetailsUI ingredientData={ingredient} />;
};
