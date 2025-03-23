import { ProductsState, Product } from '../types';

export type ProductsAction =
  | { type: 'FETCH_PRODUCTS_REQUEST' }
  | { type: 'FETCH_PRODUCTS_SUCCESS'; payload: Product[] }
  | { type: 'FETCH_PRODUCTS_FAILURE'; payload: string }
  | { type: 'FETCH_PRODUCT_REQUEST' }
  | { type: 'FETCH_PRODUCT_SUCCESS'; payload: Product }
  | { type: 'FETCH_PRODUCT_FAILURE'; payload: string }
  | { type: 'FILTER_PRODUCTS_BY_CATEGORY'; payload: number }
  | { type: 'FILTER_PRODUCTS_BY_SEARCH'; payload: string }
  | { type: 'SORT_PRODUCTS'; payload: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' }
  | { type: 'CLEAR_FILTERS' };

export const initialProductsState: ProductsState = {
  products: [],
  filteredProducts: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
};

export const productsReducer = (state: ProductsState, action: ProductsAction): ProductsState => {
  switch (action.type) {
    case 'FETCH_PRODUCTS_REQUEST':
    case 'FETCH_PRODUCT_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_PRODUCTS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        products: action.payload,
        filteredProducts: action.payload,
        error: null,
      };
    case 'FETCH_PRODUCT_SUCCESS':
      return {
        ...state,
        isLoading: false,
        selectedProduct: action.payload,
        error: null,
      };
    case 'FETCH_PRODUCTS_FAILURE':
    case 'FETCH_PRODUCT_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'FILTER_PRODUCTS_BY_CATEGORY':
      return {
        ...state,
        filteredProducts: action.payload === 0
          ? state.products
          : state.products.filter(product => product.categoryId === action.payload),
      };
    case 'FILTER_PRODUCTS_BY_SEARCH': {
      const searchTerm = action.payload.toLowerCase();
      return {
        ...state,
        filteredProducts: state.products.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
        ),
      };
    }
    case 'SORT_PRODUCTS': {
      const sortedProducts = [...state.filteredProducts];
      switch (action.payload) {
        case 'price_asc':
          sortedProducts.sort((a, b) => {
            const aPrice = a.price * (1 - a.discount / 100);
            const bPrice = b.price * (1 - b.discount / 100);
            return aPrice - bPrice;
          });
          break;
        case 'price_desc':
          sortedProducts.sort((a, b) => {
            const aPrice = a.price * (1 - a.discount / 100);
            const bPrice = b.price * (1 - b.discount / 100);
            return bPrice - aPrice;
          });
          break;
        case 'name_asc':
          sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
      return {
        ...state,
        filteredProducts: sortedProducts,
      };
    }
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filteredProducts: state.products,
      };
    default:
      return state;
  }
}; 