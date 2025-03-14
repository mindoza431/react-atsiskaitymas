import { createContext, useReducer } from 'react';

export const CartContext = createContext();

const cartReducer = (state, action) => {
  try {
    let existingItem, price, discount, discountedPrice;
    
    switch (action.type) {
      case 'ADD_TO_CART':
        if (!action.payload || !action.payload.id) {
          console.error('Neteisingi duomenys pridedant į krepšelį', action.payload);
          return state;
        }
        
        existingItem = state.find(item => item.id === action.payload.id);
        if (existingItem) {
          return state.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        
        price = action.payload.price || 0;
        discount = action.payload.discount || 0;
        discountedPrice = discount ? price * (1 - discount / 100) : price;
        
        return [...state, { 
          ...action.payload, 
          quantity: 1, 
          discountedPrice,
          originalPrice: price 
        }];

      case 'REMOVE_FROM_CART':
        return state.filter(item => item.id !== action.payload);

      case 'UPDATE_QUANTITY':
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );

      case 'CLEAR_CART':
        return [];

      default:
        return state;
    }
  } catch (error) {
    console.error('Klaida:', error);
    return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  const addToCart = (product) => {
    try {
      if (!product || !product.id) {
        console.error('Bandoma pridėti produktą į krepšelį', product);
        return;
      }
      dispatch({ type: 'ADD_TO_CART', payload: product });
    } catch (error) {
      console.error('Klaida pridedant į krepšelį:', error);
    }
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: productId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemTotal = (item) => {
    return item.discountedPrice ? item.discountedPrice * item.quantity : item.price * item.quantity;
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + getItemTotal(item), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemTotal,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 