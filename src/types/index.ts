export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  description: string;
  image: string;
  categoryId: number;
  stock: number;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface OrderItem extends CartItem {
  price: number;
}

export interface Cart {
  id: number;
  userId: number;
  products: CartItem[];
}

export interface Order {
  id: number;
  userId: number;
  products: OrderItem[];
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  address: string;
  phone: string;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  date: string;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

export type CartState = {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
};

export type ProductsState = {
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
};

export type CategoriesState = {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
};

export type OrdersState = {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}; 