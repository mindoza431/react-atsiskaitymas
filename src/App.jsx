import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useContext, useEffect } from 'react';
import theme from './theme';

import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import { UserContext } from './context/UserContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/Home';
import Products from './pages/products/Products';
import ProductDetails from './pages/products/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Users from './pages/users/Users';
import UserDetails from './pages/users/UserDetails';
import UserEdit from './pages/users/UserEdit';
import UserCreate from './pages/users/UserCreate';
import Orders from './pages/orders/Orders';
import OrderDetails from './pages/orders/OrderDetails';
import OrderCreate from './pages/orders/OrderCreate';

const AppContent = () => {
  const { fetchUsers, currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser) {
      console.log('AppContent - fetchUsers - užkraunami vartotojai');
      fetchUsers();
    } else {
      console.log('AppContent - vartotojai jau užkrauti');
    }
  }, []);

  console.log('AppContent - render');

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
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/create"
          element={
            <ProtectedRoute>
              <OrderCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <CartProvider>
          <ProductProvider>
            <OrderProvider>
              <Router>
                <AppContent />
              </Router>
            </OrderProvider>
          </ProductProvider>
        </CartProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
