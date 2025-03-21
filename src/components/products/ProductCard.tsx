import React, { useCallback } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  }, [addToCart, product]);

  const handleProductClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  }, [navigate, product.id]);

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'transform 0.2s ease-in-out',
          boxShadow: 3
        }
      }}
      onClick={handleProductClick}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary">
          {product.discount ? (
            <Box>
              <Typography component="span" sx={{ textDecoration: 'line-through', color: 'text.secondary', mr: 1 }}>
                {product.price} €
              </Typography>
              {(product.price * (1 - product.discount / 100)).toFixed(2)} €
            </Box>
          ) : (
            `${product.price} €`
          )}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleAddToCart}
          fullWidth
          sx={{ 
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
        >
          Į krepšelį
        </Button>
      </Box>
    </Card>
  );
};

export default ProductCard; 