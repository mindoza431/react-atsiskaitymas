import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { ProductContext } from '../../context/ProductContext';
import { CartContext } from '../../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, getProductById } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const existingProduct = products.find(p => p.id === Number(id));
        
        if (existingProduct) {
          setProduct(existingProduct);
          setLoading(false);
          return;
        }
        
        const fetchedProduct = await getProductById(Number(id));
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          setError('Produktas nerastas');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Klaida gaunant produktą:', err);
        setError('Įvyko klaida bandant gauti produktą');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, products]);

  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      const simpleProduct = {
        id: Number(product.id),
        name: product.name,
        price: Number(product.price),
        image: product.image,
        discount: product.discount ? Number(product.discount) : 0,
        stock: product.stock ? Number(product.stock) : 0
      };
      
      addToCart(simpleProduct);
      
      setSnackbarOpen(true);
      
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Klaida pridedant į krepšelį:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ my: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Grįžti į Produktų Sąrašą
        </Button>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ my: 3 }}>
        <Alert severity="info">Produktas nerastas</Alert>
        <Button
          variant="outlined"
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Grįžti į Produktų Sąrašą
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        variant="outlined"
        onClick={() => navigate('/products')}
        sx={{ mb: 3 }}
      >
        Grįžti į Produktų Sąrašą
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: 400,
                objectFit: 'contain'
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>

            {product.discount ? (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h5"
                  color="error"
                  sx={{ fontWeight: 'bold' }}
                >
                  {(product.price * (1 - product.discount / 100)).toFixed(2)} €
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  {product.price} €
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="error"
                >
                  Nuolaida: {product.discount}%
                </Typography>
              </Box>
            ) : (
              <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                {product.price} €
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" sx={{ mb: 2 }}>
              {product.description}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
              Kategorija: {product.category}
            </Typography>

            {product.stock > 0 ? (
              <Typography variant="subtitle1" color="success.main" gutterBottom>
                Sandėlyje: {product.stock} vnt.
              </Typography>
            ) : (
              <Typography variant="subtitle1" color="error" gutterBottom>
                Išparduota
              </Typography>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                sx={{ flex: 1 }}
              >
                Pridėti į Krepšelį
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleGoToCart}
                sx={{ flex: 1 }}
              >
                Peržiūrėti Krepšelį
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message="Prekė pridėta į krepšelį"
      />
    </Box>
  );
};

export default ProductDetails; 