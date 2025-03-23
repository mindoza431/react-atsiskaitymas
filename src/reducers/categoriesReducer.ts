import { CategoriesState, Category } from '../types';

export type CategoriesAction =
  | { type: 'FETCH_CATEGORIES_REQUEST' }
  | { type: 'FETCH_CATEGORIES_SUCCESS'; payload: Category[] }
  | { type: 'FETCH_CATEGORIES_FAILURE'; payload: string }
  | { type: 'SELECT_CATEGORY'; payload: Category | null };

export const initialCategoriesState: CategoriesState = {
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
};

export const categoriesReducer = (
  state: CategoriesState,
  action: CategoriesAction
): CategoriesState => {
  switch (action.type) {
    case 'FETCH_CATEGORIES_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_CATEGORIES_SUCCESS':
      return {
        ...state,
        isLoading: false,
        categories: action.payload,
        error: null,
      };
    case 'FETCH_CATEGORIES_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'SELECT_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
      };
    default:
      return state;
  }
}; 