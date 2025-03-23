import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components';
import {
  HomePage,
  ProductsPage,
  ProductPage,
  CategoryPage,
  CartPage,
  OrdersPage,
  OrderSuccessPage,
  LoginPage,
  RegisterPage
} from './pages';
import { AppProvider } from './contexts';

const App: React.FC = () => {
  return (
    <Router>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Layout>
      </AppProvider>
    </Router>
  );
};

export default App;
