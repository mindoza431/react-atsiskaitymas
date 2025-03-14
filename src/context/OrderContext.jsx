import { createContext, useReducer } from 'react';

export const OrderContext = createContext();

const mockOrders = [
  {
    id: 1,
    userId: 2,
    customerName: "Jonas Jonaitis",
    customerEmail: "jonas@example.com",
    customerPhone: "+37060000002",
    date: "2024-03-10T15:30:00Z",
    status: "completed",
    totalAmount: 1299.99,
    items: [
      {
        id: 1,
        productId: 1,
        productName: "iPhone 15 Pro",
        quantity: 1,
        price: 1299.99
      }
    ],
    shippingAddress: {
      street: "Laisvės al. 123",
      city: "Kaunas",
      postalCode: "44001",
      country: "Lietuva"
    }
  },
  {
    id: 2,
    userId: 2,
    customerName: "Jonas Jonaitis",
    customerEmail: "jonas@example.com",
    customerPhone: "+37060000002",
    date: "2024-03-15T10:00:00Z",
    status: "pending",
    totalAmount: 599.99,
    items: [
      {
        id: 1,
        productId: 4,
        productName: "iPad Air",
        quantity: 1,
        price: 599.99
      }
    ],
    shippingAddress: {
      street: "Laisvės al. 123",
      city: "Kaunas",
      postalCode: "44001",
      country: "Lietuva"
    }
  }
];

const initialState = {
  orders: [],
  loading: false,
  error: null,
  selectedOrder: null
};

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_ORDERS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_ORDERS_SUCCESS':
      return {
        ...state,
        loading: false,
        orders: action.payload
      };
    case 'FETCH_ORDERS_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'SET_SELECTED_ORDER':
      return {
        ...state,
        selectedOrder: action.payload
      };
    case 'CREATE_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload]
      };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id
            ? { ...order, status: action.payload.status }
            : order
        )
      };
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(order => order.id !== action.payload)
      };
    default:
      return state;
  }
};

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const fetchOrders = async () => {
    dispatch({ type: 'FETCH_ORDERS_START' });
    try {
      setTimeout(() => {
        dispatch({ type: 'FETCH_ORDERS_SUCCESS', payload: mockOrders });
      }, 500);
    } catch (error) {
      dispatch({ type: 'FETCH_ORDERS_ERROR', payload: error.message });
    }
  };

  const getOrderById = async (id) => {
    try {
      const order = mockOrders.find(o => o.id === parseInt(id));
      dispatch({ type: 'SET_SELECTED_ORDER', payload: order });
    } catch (error) {
      dispatch({ type: 'FETCH_ORDERS_ERROR', payload: error.message });
    }
  };

  const createOrder = async (orderData) => {
    try {
      const newOrder = {
        ...orderData,
        id: Math.max(...mockOrders.map(o => o.id)) + 1
      };
      mockOrders.push(newOrder);
      dispatch({ type: 'CREATE_ORDER', payload: newOrder });
      return newOrder;
    } catch (error) {
      dispatch({ type: 'FETCH_ORDERS_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const order = mockOrders.find(o => o.id === parseInt(id));
      if (order) {
        order.status = status;
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id, status } });
      }
    } catch (error) {
      dispatch({ type: 'FETCH_ORDERS_ERROR', payload: error.message });
    }
  };

  const deleteOrder = async (id) => {
    try {
      const index = mockOrders.findIndex(o => o.id === parseInt(id));
      if (index !== -1) {
        mockOrders.splice(index, 1);
      }
      dispatch({ type: 'DELETE_ORDER', payload: id });
    } catch (error) {
      dispatch({ type: 'FETCH_ORDERS_ERROR', payload: error.message });
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders: state.orders,
        loading: state.loading,
        error: state.error,
        selectedOrder: state.selectedOrder,
        fetchOrders,
        getOrderById,
        createOrder,
        updateOrderStatus,
        deleteOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}; 