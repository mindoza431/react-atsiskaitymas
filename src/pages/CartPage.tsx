import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, useProducts, useAuth, useOrders } from '../contexts';
import { Product } from '../types';
import '../styles/CartPage.css';

export const CartPage: React.FC = () => {
  const { state: cartState, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const { state: productsState, fetchProducts } = useProducts();
  const { state: authState } = useAuth();
  const { createNewOrder } = useOrders();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const cartItems = cartState.items.map(item => {
    const product = productsState.products.find(p => p.id === item.productId);
    return {
      ...item,
      product,
    };
  });

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authState.isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    
    try {
      const orderProducts = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product ? item.product.price * (1 - (item.product.discount || 0) / 100) : 0,
      }));

      const order = {
        userId: authState.user!.id,
        products: orderProducts,
        total: getTotalPrice(productsState.products),
        status: 'processing' as const,
        date: new Date().toISOString(),
        address: formData.address,
        phone: formData.phone,
      };

      await createNewOrder(order);
      clearCart();
      navigate('/order-success');
    } catch (error) {
      console.error('Klaida kuriant užsakymą:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = getTotalPrice(productsState.products);

  return (
    <div className="cart-page">
      <h1 className="mb-4">Jūsų krepšelis</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart text-center">
          <i className="bi bi-cart-x empty-cart-icon"></i>
          <h3>Jūsų krepšelis tuščias</h3>
          <p>Pridėkite prekių į krepšelį, kad galėtumėte tęsti.</p>
          <Link to="/products" className="btn btn-primary mt-3">
            Naršyti prekes
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Prekės krepšelyje ({cartItems.length})</h5>
              </div>
              <div className="card-body">
                {cartItems.map(item => {
                  const product = item.product as Product | undefined;
                  if (!product) return null;

                  const discountedPrice = product.price * (1 - product.discount / 100);
                  const itemTotal = discountedPrice * item.quantity;

                  return (
                    <div key={item.productId} className="cart-item">
                      <div className="row align-items-center">
                        <div className="col-3 col-md-2">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="img-fluid rounded cart-item-image"
                          />
                        </div>
                        <div className="col-9 col-md-5">
                          <h5 className="mb-0">
                            <Link to={`/product/${product.id}`} className="text-decoration-none">
                              {product.name}
                            </Link>
                          </h5>
                          <div className="mt-2">
                            {product.discount > 0 ? (
                              <>
                                <span className="text-muted text-decoration-line-through me-2">
                                  {product.price.toFixed(2)} €
                                </span>
                                <span className="text-primary fw-bold">
                                  {discountedPrice.toFixed(2)} €
                                </span>
                              </>
                            ) : (
                              <span className="text-primary fw-bold">
                                {product.price.toFixed(2)} €
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-6 col-md-3 mt-3 mt-md-0">
                          <div className="quantity-control">
                            <select
                              className="form-select"
                              value={item.quantity}
                              onChange={e => handleUpdateQuantity(item.productId, Number(e.target.value))}
                            >
                              {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-4 col-md-1 mt-3 mt-md-0 text-end">
                          <span className="fw-bold">{itemTotal.toFixed(2)} €</span>
                        </div>
                        <div className="col-2 col-md-1 mt-3 mt-md-0 text-end">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveItem(item.productId)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                      <hr className="my-3" />
                    </div>
                  );
                })}
              </div>
              <div className="card-footer d-flex justify-content-between">
                <Link to="/products" className="btn btn-outline-primary">
                  <i className="bi bi-arrow-left me-2"></i>
                  Tęsti apsipirkimą
                </Link>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => clearCart()}
                >
                  <i className="bi bi-trash me-2"></i>
                  Išvalyti krepšelį
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Užsakymo suvestinė</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <span>Prekių suma:</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Pristatymas:</span>
                  <span>0.00 €</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <strong>Iš viso:</strong>
                  <strong className="text-primary">{totalPrice.toFixed(2)} €</strong>
                </div>

                <form onSubmit={handleCheckout}>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Pristatymo adresas</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Telefono numeris</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={cartItems.length === 0 || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Apdorojama...
                      </>
                    ) : (
                      'Pateikti užsakymą'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 