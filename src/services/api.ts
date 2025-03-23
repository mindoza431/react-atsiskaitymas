import axios from 'axios';
import { User, Product, Category, Cart, Order, Review } from '../types';

const API_URL = 'http://localhost:3003';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Užklausa užtruko per ilgai, timeout klaida');
    }
    
    if (error.code === 'ERR_NETWORK') {
      console.error('Tinklo klaida. Patikrinkite, ar JSON serveris veikia adresu: http://localhost:3003');
    }
    
    return Promise.reject(error);
  }
);

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const response = await api.get(`/users?email=${email}`);
    const users = response.data;
    
    if (users.length === 0) {
      return null;
    }
    
    const user = users[0];
    if (user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    return null;
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
};

export const registerUser = async (name: string, email: string, password: string): Promise<User | null> => {
  try {
    const checkResponse = await api.get(`/users?email=${email}`);
    if (checkResponse.data.length > 0) {
      return null;
    }
    
    const response = await api.post('/users', {
      name,
      email,
      password,
      role: 'user',
    });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = response.data;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error registering user:', error);
    return null;
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const response = await api.get(`/products?categoryId=${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products by category ${categoryId}:`, error);
    throw error;
  }
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const response = await api.post<Product>('/products', product);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
  try {
    const response = await api.patch<Product>(`/products/${id}`, product);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategoryById = async (id: number): Promise<Category | null> => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    throw error;
  }
};

export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  const response = await api.post<Category>('/categories', category);
  return response.data;
};

export const updateCategory = async (id: number, category: Partial<Category>): Promise<Category> => {
  const response = await api.patch<Category>(`/categories/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

export const getCartByUserId = async (userId: number): Promise<Cart> => {
  const response = await api.get<Cart[]>(`/cart?userId=${userId}`);
  if (response.data.length === 0) {
    throw new Error('Krepšelis nerastas');
  }
  return response.data[0];
};

export const updateCart = async (cartId: number, cartData: Partial<Cart>): Promise<Cart> => {
  const response = await api.patch<Cart>(`/cart/${cartId}`, cartData);
  return response.data;
};

export const getOrdersByUserId = async (userId: number): Promise<Order[]> => {
  try {
    const response = await api.get(`/orders?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    throw error;
  }
};

export const getOrderById = async (id: number): Promise<Order | null> => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    return null;
  }
};

export const createOrder = async (orderData: Omit<Order, 'id'>): Promise<Order> => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id: number, status: Order['status']): Promise<Order> => {
  try {
    const order = await getOrderById(id);
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }
    
    const response = await api.patch(`/orders/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${id} status:`, error);
    throw error;
  }
};

export const getReviewsByProductId = async (productId: number): Promise<Review[]> => {
  try {
    const response = await api.get(`/reviews?productId=${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    return [];
  }
};

export const createReview = async (reviewData: Omit<Review, 'id'>): Promise<Review> => {
  const response = await api.post<Review>('/reviews', reviewData);
  return response.data;
};

export default api; 