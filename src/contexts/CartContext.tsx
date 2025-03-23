import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { cartReducer, initialCartState } from '../reducers/cartReducer';
import { getCartByUserId, updateCart } from '../services/api';
import { CartState, Product } from '../types';
import { useAuth } from './AuthContext';

interface CartContextProps {
  state: CartState;
  addToCart: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: (products: Product[]) => number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const { state: authState } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      if (authState.user) {
        dispatch({ type: 'FETCH_CART_REQUEST' });
        try {
          const cart = await getCartByUserId(authState.user.id);
          dispatch({ type: 'FETCH_CART_SUCCESS', payload: cart.products });
        } catch (error) {
          dispatch({ 
            type: 'FETCH_CART_FAILURE', 
            payload: error instanceof Error ? error.message : 'Klaida gaunant krepšelio duomenis'
          });
        }
      } else {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          dispatch({ type: 'FETCH_CART_SUCCESS', payload: JSON.parse(savedCart) });
        }
      }
    };

    fetchCart();
  }, [authState.user]);

  useEffect(() => {
    if (authState.user) {
      const saveCart = async () => {
        try {
          const cart = await getCartByUserId(authState.user!.id);
          await updateCart(cart.id, { products: state.items });
        } catch (error) {
          console.error('Nepavyko išsaugoti krepšelio:', error);
        }
      };

      if (state.items.length > 0) {
        saveCart();
      }
    } else {
      localStorage.setItem('cart', JSON.stringify(state.items));
    }
  }, [state.items, authState.user]);

  const addToCart = (productId: number, quantity: number) => {
    dispatch({ type: 'ADD_TO_CART', payload: { productId, quantity } });
  };

  const removeFromCart = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = (products: Product[]) => {
    return state.items.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const discountedPrice = product.price * (1 - product.discount / 100);
        return total + discountedPrice * item.quantity;
      }
      return total;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 