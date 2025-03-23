import { CartState, CartItem } from '../types';

export type CartAction =
  | { type: 'FETCH_CART_REQUEST' }
  | { type: 'FETCH_CART_SUCCESS'; payload: CartItem[] }
  | { type: 'FETCH_CART_FAILURE'; payload: string }
  | { type: 'ADD_TO_CART'; payload: { productId: number; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' };

export const initialCartState: CartState = {
  items: [],
  isLoading: false,
  error: null,
};

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'FETCH_CART_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_CART_SUCCESS':
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        error: null,
      };
    case 'FETCH_CART_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'ADD_TO_CART': {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productId === productId);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item => 
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          items: [...state.items, { productId, quantity }],
        };
      }
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item => 
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
}; 