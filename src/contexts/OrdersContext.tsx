import React, { createContext, useReducer, useContext, ReactNode, useState, useCallback } from 'react';
import { ordersReducer, initialOrdersState } from '../reducers/ordersReducer';
import { 
  getOrdersByUserId, 
  getOrderById, 
  createOrder, 
  updateOrderStatus 
} from '../services/api';
import { OrdersState, Order } from '../types';
import { useAuth } from './AuthContext';

interface OrdersContextProps {
  state: OrdersState;
  fetchOrders: () => Promise<void>;
  fetchOrder: (id: number) => Promise<void>;
  createNewOrder: (orderData: Omit<Order, 'id'>) => Promise<void>;
  updateStatus: (id: number, status: Order['status']) => Promise<void>;
  connectionError: boolean;
  retryFetch: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextProps | undefined>(undefined);

interface OrdersProviderProps {
  children: ReactNode;
}

export const OrdersProvider: React.FC<OrdersProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(ordersReducer, initialOrdersState);
  const { state: authState } = useAuth();
  const [connectionError, setConnectionError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchOrders = useCallback(async () => {
    if (!authState.user) return;

    if (retryCount >= maxRetries) {
      setConnectionError(true);
      return;
    }

    dispatch({ type: 'FETCH_ORDERS_REQUEST' });
    try {
      const orders = await getOrdersByUserId(authState.user.id);
      dispatch({ type: 'FETCH_ORDERS_SUCCESS', payload: orders });
      setConnectionError(false);
    } catch (error) {
      console.error('Error fetching orders in context:', error);
      dispatch({
        type: 'FETCH_ORDERS_FAILURE',
        payload: error instanceof Error ? error.message : 'Klaida gaunant užsakymus',
      });

      if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_NETWORK') {
        setConnectionError(true);
        setRetryCount(prev => prev + 1);
      }
    }
  }, [authState.user, retryCount, maxRetries]);

  const retryFetch = useCallback(async () => {
    setRetryCount(0);
    setConnectionError(false);
    await fetchOrders();
  }, [fetchOrders]);

  const fetchOrder = useCallback(async (id: number) => {
    dispatch({ type: 'FETCH_ORDER_REQUEST' });
    try {
      const order = await getOrderById(id);
      if (order) {
        dispatch({ type: 'FETCH_ORDER_SUCCESS', payload: order });
      } else {
        throw new Error('Užsakymas nerastas');
      }
    } catch (error) {
      dispatch({
        type: 'FETCH_ORDER_FAILURE',
        payload: error instanceof Error ? error.message : 'Klaida gaunant užsakymą',
      });
    }
  }, []);

  const createNewOrder = useCallback(async (orderData: Omit<Order, 'id'>) => {
    dispatch({ type: 'CREATE_ORDER_REQUEST' });
    try {
      const order = await createOrder(orderData);
      dispatch({ type: 'CREATE_ORDER_SUCCESS', payload: order });
    } catch (error) {
      dispatch({
        type: 'CREATE_ORDER_FAILURE',
        payload: error instanceof Error ? error.message : 'Klaida kuriant užsakymą',
      });
    }
  }, []);

  const updateStatus = useCallback(async (id: number, status: Order['status']) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS_REQUEST' });
    try {
      const order = await updateOrderStatus(id, status);
      dispatch({ type: 'UPDATE_ORDER_STATUS_SUCCESS', payload: order });
    } catch (error) {
      dispatch({
        type: 'UPDATE_ORDER_STATUS_FAILURE',
        payload: error instanceof Error ? error.message : 'Klaida atnaujinant užsakymo būseną',
      });
    }
  }, []);

  return (
    <OrdersContext.Provider
      value={{
        state,
        fetchOrders,
        fetchOrder,
        createNewOrder,
        updateStatus,
        connectionError,
        retryFetch
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = (): OrdersContextProps => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}; 