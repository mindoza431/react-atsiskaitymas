import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../contexts';
import '../styles/ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const discountedPrice = product.price * (1 - product.discount / 100);
  
  const handleAddToCart = () => {
    addToCart(product.id, 1);
  };
  
  return (
    <div className="product-card card h-100">
      <div className="product-image-container">
        <img 
          src={product.image} 
          className="card-img-top product-image" 
          alt={product.name} 
        />
        {product.discount > 0 && (
          <div className="discount-badge">-{product.discount}%</div>
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title product-title">{product.name}</h5>
        <p className="card-text product-description text-truncate">{product.description}</p>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <div className="price-container">
              {product.discount > 0 ? (
                <>
                  <span className="original-price">{product.price.toFixed(2)} €</span>
                  <span className="discounted-price">{discountedPrice.toFixed(2)} €</span>
                </>
              ) : (
                <span className="regular-price">{product.price.toFixed(2)} €</span>
              )}
            </div>
            <span className="stock-info">Likutis: {product.stock}</span>
          </div>
          <div className="mt-3 d-flex gap-2">
            <Link 
              to={`/product/${product.id}`} 
              className="btn btn-outline-primary flex-grow-1"
            >
              Peržiūrėti
            </Link>
            <button 
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <i className="bi bi-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 