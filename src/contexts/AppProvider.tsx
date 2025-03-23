import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { ProductsProvider } from './ProductsContext';
import { CategoriesProvider } from './CategoriesContext';
import { OrdersProvider } from './OrdersContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductsProvider>
          <CategoriesProvider>
            <OrdersProvider>
              {children}
            </OrdersProvider>
          </CategoriesProvider>
        </ProductsProvider>
      </CartProvider>
    </AuthProvider>
  );
}; 