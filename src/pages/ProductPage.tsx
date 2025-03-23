import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts, useCart } from '../contexts';
import { getReviewsByProductId } from '../services/api';
import { Review } from '../types';
import '../styles/ProductPage.css';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state: productsState, fetchProduct } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id));
      loadReviews(parseInt(id));
    }
  }, [id, fetchProduct]);

  const loadReviews = async (productId: number) => {
    setLoading(true);
    try {
      const data = await getReviewsByProductId(productId);
      setReviews(data);
    } catch (error) {
      console.error('Klaida gaunant atsiliepimus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (productsState.selectedProduct) {
      addToCart(productsState.selectedProduct.id, quantity);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  if (productsState.isLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Kraunama...</span>
        </div>
      </div>
    );
  }

  if (!productsState.selectedProduct) {
    return (
      <div className="alert alert-danger">
        Produktas nerastas. <Link to="/products">Grįžti į produktų sąrašą</Link>
      </div>
    );
  }

  const { selectedProduct } = productsState;
  const discountedPrice = selectedProduct.price * (1 - selectedProduct.discount / 100);

  return (
    <div className="product-details">
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="product-image-container">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="product-image img-fluid"
            />
            {selectedProduct.discount > 0 && (
              <div className="discount-badge">-{selectedProduct.discount}%</div>
            )}
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Pagrindinis</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/products">Produktai</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {selectedProduct.name}
              </li>
            </ol>
          </nav>

          <h1 className="product-title">{selectedProduct.name}</h1>
          <div className="mb-3">
            {selectedProduct.discount > 0 ? (
              <div className="price-container">
                <span className="original-price">{selectedProduct.price.toFixed(2)} €</span>
                <span className="discounted-price">{discountedPrice.toFixed(2)} €</span>
              </div>
            ) : (
              <span className="regular-price">{selectedProduct.price.toFixed(2)} €</span>
            )}
          </div>

          <div className="mb-4 stock-info">
            <span className={`badge ${selectedProduct.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
              {selectedProduct.stock > 0 ? 'Yra sandėlyje' : 'Nėra sandėlyje'}
            </span>
            {selectedProduct.stock > 0 && (
              <span className="ms-2 text-muted">Likutis: {selectedProduct.stock} vnt.</span>
            )}
          </div>

          <p className="product-description mb-4">{selectedProduct.description}</p>

          {selectedProduct.stock > 0 && (
            <div className="d-flex align-items-center mb-4">
              <div className="me-3">
                <label htmlFor="quantity" className="form-label">Kiekis:</label>
                <select
                  id="quantity"
                  className="form-select"
                  value={quantity}
                  onChange={handleQuantityChange}
                >
                  {[...Array(Math.min(selectedProduct.stock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={selectedProduct.stock === 0}
              >
                <i className="bi bi-cart-plus me-2"></i>
                Pridėti į krepšelį
              </button>
            </div>
          )}

          <div className="mt-4">
            <h4>Atsiliepimai</h4>
            {loading ? (
              <p>Kraunami atsiliepimai...</p>
            ) : reviews.length > 0 ? (
              <div className="reviews-container">
                {reviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="d-flex justify-content-between">
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi ${
                              i < review.rating ? 'bi-star-fill' : 'bi-star'
                            } text-warning`}
                          ></i>
                        ))}
                      </div>
                      <small className="text-muted">
                        {new Date(review.date).toLocaleDateString('lt-LT')}
                      </small>
                    </div>
                    <p className="review-comment mt-2 mb-0">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Kol kas nėra atsiliepimų.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 