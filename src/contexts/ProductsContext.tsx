import React, { createContext, useReducer, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { productsReducer, initialProductsState } from '../reducers/productsReducer';
import { getProducts, getProductById, getProductsByCategory } from '../services/api';
import { ProductsState } from '../types';

interface ProductsContextProps {
  state: ProductsState;
  fetchProducts: () => Promise<void>;
  fetchProduct: (id: number) => Promise<void>;
  fetchProductsByCategory: (categoryId: number) => Promise<void>;
  filterByCategory: (categoryId: number) => void;
  filterBySearch: (searchTerm: string) => void;
  sortProducts: (sortBy: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc') => void;
  clearFilters: () => void;
  connectionError: boolean;
  retryFetch: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextProps | undefined>(undefined);

interface ProductsProviderProps {
  children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(productsReducer, initialProductsState);
  const [connectionError, setConnectionError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchProducts = useCallback(async () => {
    if (retryCount >= maxRetries) {
      setConnectionError(true);
      return;
    }

    dispatch({ type: 'FETCH_PRODUCTS_REQUEST' });
    try {
      const products = await getProducts();
      dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: products });
      setConnectionError(false);
    } catch (error) {
      console.error('Error fetching products in context:', error);
      dispatch({
        type: 'FETCH_PRODUCTS_FAILURE',
        payload: error instanceof Error ? error.message : 'Klaida gaunant produktus',
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
    await fetchProducts();
  }, [fetchProducts]);

  const fetchProduct = useCallback(async (id: number) => {
    dispatch({ type: 'FETCH_PRODUCT_REQUEST' });
    try {
      const product = await getProductById(id);
      if (product) {
        dispatch({ type: 'FETCH_PRODUCT_SUCCESS', payload: product });
      } else {
        throw new Error('Produktas nerastas');
      }
    } catch (error) {
      dispatch({
        type: 'FETCH_PRODUCT_FAILURE',
        payload: error instanceof Error ? error.message : 'Klaida gaunant produktą',
      });
    }
  }, []);

  const fetchProductsByCategory = useCallback(async (categoryId: number) => {
    dispatch({ type: 'FETCH_PRODUCTS_REQUEST' });
    try {
      const products = await getProductsByCategory(categoryId);
      dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: products });
    } catch (error) {
      dispatch({
        type: 'FETCH_PRODUCTS_FAILURE',
        payload: error instanceof Error ? error.message : 'Klaida gaunant produktus pagal kategoriją',
      });
    }
  }, []);

  const filterByCategory = useCallback((categoryId: number) => {
    dispatch({ type: 'FILTER_PRODUCTS_BY_CATEGORY', payload: categoryId });
  }, []);

  const filterBySearch = useCallback((searchTerm: string) => {
    dispatch({ type: 'FILTER_PRODUCTS_BY_SEARCH', payload: searchTerm });
  }, []);

  const sortProducts = useCallback((sortBy: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc') => {
    dispatch({ type: 'SORT_PRODUCTS', payload: sortBy });
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

  useEffect(() => {
    // Tik vieną kartą krauname duomenis komponento montavimo metu
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        state,
        fetchProducts,
        fetchProduct,
        fetchProductsByCategory,
        filterByCategory,
        filterBySearch,
        sortProducts,
        clearFilters,
        connectionError,
        retryFetch
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = (): ProductsContextProps => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}; 