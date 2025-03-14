import { createContext, useReducer } from 'react';

export const ProductContext = createContext();

const API_URL = 'http://localhost:3001';

const initialState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null
};

const productReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_PRODUCTS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_PRODUCTS_SUCCESS':
      return {
        ...state,
        loading: false,
        products: action.payload
      };
    case 'FETCH_PRODUCTS_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'SET_SELECTED_PRODUCT':
      return {
        ...state,
        selectedProduct: action.payload
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload]
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        )
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };
    default:
      return state;
  }
};

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const fetchProducts = async () => {
    dispatch({ type: 'FETCH_PRODUCTS_START' });
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error('Nepavyko gauti produktų');
      const data = await response.json();
      dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_PRODUCTS_ERROR', payload: error.message });
    }
  };

  const getProductById = async (id) => {
    try {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      
      const existingProduct = state.products.find(p => p.id === numericId);
      if (existingProduct) {
        return existingProduct;
      }

      const response = await fetch(`${API_URL}/products/${numericId}`);
      if (!response.ok) throw new Error('Produktas nerastas');
      const product = await response.json();
      return product;
    } catch (error) {
      console.error('Klaida gaunant produktą:', error);
      return null;
    }
  };

  const addProduct = async (product) => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      });
      if (!response.ok) throw new Error('Nepavyko pridėti produkto');
      const newProduct = await response.json();
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
      return newProduct;
    } catch (error) {
      dispatch({ type: 'FETCH_PRODUCTS_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateProduct = async (id, product) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      });
      if (!response.ok) throw new Error('Nepavyko atnaujinti produkto');
      const updatedProduct = await response.json();
      dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
    } catch (error) {
      dispatch({ type: 'FETCH_PRODUCTS_ERROR', payload: error.message });
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Nepavyko ištrinti produkto');
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    } catch (error) {
      dispatch({ type: 'FETCH_PRODUCTS_ERROR', payload: error.message });
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products: state.products,
        loading: state.loading,
        error: state.error,
        selectedProduct: state.selectedProduct,
        fetchProducts,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}; 