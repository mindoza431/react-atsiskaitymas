import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { Product } from '../../types';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  Rating,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Snackbar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct } = useProduct();
  const { addToCart } = useCart();
  const { currentUser } = useUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Produkto ID nerastas');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const productData = await getProduct(parseInt(id));
        if (!productData) {
          setError('Produktas nerastas');
        } else {
          setProduct(productData);
        }
      } catch (err) {
        setError('Įvyko klaida bandant gauti produktą');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, getProduct]);

  const handleGoBack = () => {
    navigate('/products');
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={4}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'Produktas nerastas'}
          </Alert>
          <Button variant="contained" onClick={handleGoBack}>
            Grįžti į produktų sąrašą
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box py={4}>
        <Button
          variant="outlined"
          onClick={handleGoBack}
          sx={{ mb: 3 }}
        >
          ← Grįžti
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: 2
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain'
                }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>

              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Rating value={product.rating} readOnly precision={0.5} />
                <Typography variant="body2" color="text.secondary">
                  ({product.reviews} atsiliepimai)
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h5" color="primary" gutterBottom>
                {product.discount && product.discount > 0 ? (
                  <Box>
                    <Typography
                      component="span"
                      sx={{ textDecoration: 'line-through', color: 'text.secondary', mr: 2 }}
                    >
                      {product.price} €
                    </Typography>
                    {(product.price * (1 - product.discount / 100)).toFixed(2)} €
                  </Box>
                ) : (
                  `${product.price} €`
                )}
              </Typography>

              {product.discount && product.discount > 0 && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ mb: 2 }}
                >
                  {product.discount}% nuolaida!
                </Typography>
              )}

              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>

              <Box display="flex" gap={2} mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  {product.stock > 0 ? 'Į krepšelį' : 'Išparduota'}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/checkout', { state: { fromProduct: true } })}
                  disabled={product.stock === 0}
                >
                  Pirkti dabar
                </Button>
              </Box>

              {product.stock === 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Šiuo metu prekė išparduota
                </Alert>
              )}
            </Box>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
            Prekė pridėta į krepšelį!
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ProductDetails; 