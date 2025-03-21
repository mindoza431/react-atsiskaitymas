import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import theme from './theme';

import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

import { Products } from './pages/products/Products';
import { Users } from './pages/users/Users';
import Home from './pages/Home';
import ProductDetails from './pages/products/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDetails from './pages/users/UserDetails';
import UserEdit from './pages/users/UserEdit';
import UserCreate from './pages/users/UserCreate';
import Orders from './pages/orders/Orders';
import OrderDetails from './pages/orders/OrderDetails';
import OrderCreate from './pages/orders/OrderCreate';
import Checkout from './pages/Checkout';
import { useUser } from './context/UserContext';

const AppContent: React.FC = () => {
  const { fetchUsers, currentUser } = useUser();

  useEffect(() => {
    if (!currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={currentUser ? <Navigate to="/" replace /> : <Register />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute requiredRole="user">
              <Checkout />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/create"
          element={
            <ProtectedRoute requiredRole="admin">
              <UserCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <UserDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id/edit"
          element={
            <ProtectedRoute requiredRole="admin">
              <UserEdit />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/orders"
          element={
            <ProtectedRoute requiredRole="user">
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/create"
          element={
            <ProtectedRoute requiredRole="user">
              <OrderCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute requiredRole="user">
              <OrderDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserProvider>
          <CartProvider>
            <ProductProvider>
              <OrderProvider>
                <AppContent />
              </OrderProvider>
            </ProductProvider>
          </CartProvider>
        </UserProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
