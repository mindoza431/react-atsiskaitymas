import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrders, useAuth, useProducts } from '../contexts';
import { Order } from '../types';
import '../styles/OrdersPage.css';
import { Container, Alert, Button } from 'react-bootstrap';

export const OrdersPage: React.FC = () => {
  const { state: ordersState, fetchOrders, connectionError, retryFetch } = useOrders();
  const { state: authState } = useAuth();
  const { state: productsState, fetchProducts } = useProducts();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      fetchOrders();
      fetchProducts();
    }
  }, [authState.isAuthenticated, authState.user, fetchOrders, fetchProducts]);

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProductName = (productId: number): string => {
    const product = productsState.products.find(p => p.id === productId);
    return product ? product.name : 'Prekė nerasta';
  };

  const getProductImage = (productId: number): string => {
    const product = productsState.products.find(p => p.id === productId);
    return product ? product.image : '';
  };

  const getStatusLabel = (status: string): { label: string; color: string } => {
    switch (status) {
      case 'processing':
        return { label: 'Apdorojamas', color: 'warning' };
      case 'shipped':
        return { label: 'Išsiųstas', color: 'info' };
      case 'delivered':
        return { label: 'Pristatytas', color: 'success' };
      case 'cancelled':
        return { label: 'Atšauktas', color: 'danger' };
      default:
        return { label: 'Nežinoma būsena', color: 'secondary' };
    }
  };

  const sortedOrders = [...ordersState.orders].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const userOrders = authState.isAuthenticated && authState.user 
    ? sortedOrders.filter(order => order.userId === authState.user!.id)
    : [];

  if (!authState.isAuthenticated) {
    return (
      <div className="not-authenticated">
        <h1>Prisijunkite, kad galėtumėte matyti savo užsakymus</h1>
        <Link to="/login" className="btn btn-primary">Prisijungti</Link>
      </div>
    );
  }

  if (connectionError) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Tinklo klaida!</Alert.Heading>
          <p>
            Nepavyko prisijungti prie serverio. Patikrinkite, ar JSON serveris veikia adresu http://localhost:3003.
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button 
              onClick={() => retryFetch()}
              variant="outline-danger"
            >
              Bandyti dar kartą
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="orders-page">
      <h1 className="mb-4">Mano užsakymai</h1>

      {ordersState.isLoading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Kraunama...</span>
          </div>
        </div>
      ) : userOrders.length === 0 ? (
        <div className="no-orders">
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            Jūs dar neturite užsakymų.
          </div>
          <Link to="/products" className="btn btn-primary mt-3">
            Naršyti prekes
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {userOrders.map((order: Order) => {
            const statusInfo = getStatusLabel(order.status);
            
            return (
              <div key={order.id} className="order-card mb-4">
                <div className="order-header">
                  <div className="row align-items-center">
                    <div className="col-md-3">
                      <div className="order-number">
                        <small className="text-muted">Užsakymo nr.</small>
                        <div className="fw-bold">#{order.id}</div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="order-date">
                        <small className="text-muted">Data</small>
                        <div>{formatDate(order.date)}</div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="order-status">
                        <small className="text-muted">Būsena</small>
                        <div>
                          <span className={`badge bg-${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="order-total">
                        <small className="text-muted">Suma</small>
                        <div className="fw-bold">{order.total.toFixed(2)} €</div>
                      </div>
                    </div>
                  </div>
                  <button
                    className={`btn btn-link order-toggle ${expandedOrder === order.id ? 'open' : ''}`}
                    onClick={() => toggleOrderDetails(order.id!)}
                  >
                    {expandedOrder === order.id ? (
                      <><i className="bi bi-chevron-up"></i> Slėpti detales</>
                    ) : (
                      <><i className="bi bi-chevron-down"></i> Rodyti detales</>
                    )}
                  </button>
                </div>

                {expandedOrder === order.id && (
                  <div className="order-details">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="delivery-info mb-3">
                          <h5>Pristatymo informacija</h5>
                          <p className="mb-1"><strong>Adresas:</strong> {order.address}</p>
                          <p><strong>Telefonas:</strong> {order.phone}</p>
                        </div>
                      </div>
                    </div>

                    <h5>Užsakytos prekės</h5>
                    <div className="order-products">
                      {order.products.map((item) => (
                        <div key={item.productId} className="order-product-item">
                          <div className="row align-items-center">
                            <div className="col-2 col-md-1">
                              <img
                                src={getProductImage(item.productId)}
                                alt={getProductName(item.productId)}
                                className="img-fluid rounded order-product-image"
                              />
                            </div>
                            <div className="col-7 col-md-8">
                              <div className="order-product-name">
                                {getProductName(item.productId)}
                              </div>
                            </div>
                            <div className="col-3 col-md-3 text-end">
                              <div className="order-product-quantity">
                                {item.quantity} vnt. x {item.price.toFixed(2)} €
                              </div>
                              <div className="order-product-total">
                                {(item.quantity * item.price).toFixed(2)} €
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};