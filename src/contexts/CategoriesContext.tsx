import React, { createContext, useReducer, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { categoriesReducer, initialCategoriesState } from '../reducers/categoriesReducer';
import { getCategories, getCategoryById } from '../services/api';
import { CategoriesState, Category } from '../types';

interface CategoriesContextProps {
  state: CategoriesState;
  fetchCategories: () => Promise<void>;
  fetchCategoryById: (id: number) => Promise<Category | null>;
  selectCategory: (category: Category | null) => void;
  connectionError: boolean;
  retryFetch: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextProps | undefined>(undefined);

interface CategoriesProviderProps {
  children: ReactNode;
}

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(categoriesReducer, initialCategoriesState);
  const [connectionError, setConnectionError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchCategories = useCallback(async () => {
    if (retryCount >= maxRetries) {
      setConnectionError(true);
      return;
    }

    dispatch({ type: 'FETCH_CATEGORIES_REQUEST' });
    try {
      const categories = await getCategories();
      dispatch({ type: 'FETCH_CATEGORIES_SUCCESS', payload: categories });
      setConnectionError(false);
    } catch (error) {
      console.error('Error fetching categories in context:', error);
      dispatch({
        type: 'FETCH_CATEGORIES_FAILURE',
        payload: error instanceof Error ? error.message : 'Klaida gaunant kategorijas',
      });

      if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_NETWORK') {
        setConnectionError(true);
        setRetryCount(prev => prev + 1);
      }
    }
  }, [retryCount, maxRetries]);

  const retryFetch = useCallback(async () => {
    setRetryCount(0);
    setConnectionError(false);
    await fetchCategories();
  }, [fetchCategories]);

  const fetchCategoryById = useCallback(async (id: number): Promise<Category | null> => {
    try {
      const category = await getCategoryById(id);
      return category;
    } catch (error) {
      console.error(`Error fetching category with id ${id}:`, error);
      return null;
    }
  }, []);

  const selectCategory = useCallback((category: Category | null) => {
    dispatch({ type: 'SELECT_CATEGORY', payload: category });
  }, []);

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CategoriesContext.Provider
      value={{
        state,
        fetchCategories,
        fetchCategoryById,
        selectCategory,
        connectionError,
        retryFetch
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = (): CategoriesContextProps => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}; 