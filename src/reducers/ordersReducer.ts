import { OrdersState, Order } from '../types';

export type OrdersAction =
  | { type: 'FETCH_ORDERS_REQUEST' }
  | { type: 'FETCH_ORDERS_SUCCESS'; payload: Order[] }
  | { type: 'FETCH_ORDERS_FAILURE'; payload: string }
  | { type: 'FETCH_ORDER_REQUEST' }
  | { type: 'FETCH_ORDER_SUCCESS'; payload: Order }
  | { type: 'FETCH_ORDER_FAILURE'; payload: string }
  | { type: 'CREATE_ORDER_REQUEST' }
  | { type: 'CREATE_ORDER_SUCCESS'; payload: Order }
  | { type: 'CREATE_ORDER_FAILURE'; payload: string }
  | { type: 'UPDATE_ORDER_STATUS_REQUEST' }
  | { type: 'UPDATE_ORDER_STATUS_SUCCESS'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS_FAILURE'; payload: string };

export const initialOrdersState: OrdersState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
};

export const ordersReducer = (state: OrdersState, action: OrdersAction): OrdersState => {
  switch (action.type) {
    case 'FETCH_ORDERS_REQUEST':
    case 'FETCH_ORDER_REQUEST':
    case 'CREATE_ORDER_REQUEST':
    case 'UPDATE_ORDER_STATUS_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_ORDERS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        orders: action.payload,
        error: null,
      };
    case 'FETCH_ORDER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        selectedOrder: action.payload,
        error: null,
      };
    case 'CREATE_ORDER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        orders: [...state.orders, action.payload],
        selectedOrder: action.payload,
        error: null,
      };
    case 'UPDATE_ORDER_STATUS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? action.payload : order
        ),
        selectedOrder: action.payload,
        error: null,
      };
    case 'FETCH_ORDERS_FAILURE':
    case 'FETCH_ORDER_FAILURE':
    case 'CREATE_ORDER_FAILURE':
    case 'UPDATE_ORDER_STATUS_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}; 