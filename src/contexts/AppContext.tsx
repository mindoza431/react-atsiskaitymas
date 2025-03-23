import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ProductsProvider } from './ProductsContext';
import { CartProvider } from './CartContext';
import ErrorBoundary from '../components/ErrorBoundary';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}; 