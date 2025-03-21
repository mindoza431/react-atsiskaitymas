import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box
} from '@mui/material';
import { useProduct } from '../context/ProductContext';

const Home = () => {
  const navigate = useNavigate();
  const { products, loading, error, fetchProducts } = useProduct();

  useEffect(() => {
    fetchProducts();
  }, []);

  const featuredProducts = products.slice(0, 4); 

  if (loading) return <Typography>Kraunama...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          position: 'relative',
          height: '400px',
          py: 8,
          mb: 6,
          borderRadius: 2,
          textAlign: 'center',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: 'url(https://images.unsplash.com/photo-1523275335684-37898b6baf30)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backgroundBlendMode: 'overlay'
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            fontWeight: 'bold'
          }}
        >
          Sveiki atvykę į E-Parduotuvę
        </Typography>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom
          sx={{ 
            color: 'white',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            mb: 4
          }}
        >
          Atraskite geriausius produktus geriausiomis kainomis
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate('/products')}
          sx={{ 
            mt: 2,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 8px rgba(0,0,0,0.3)'
            }
          }}
        >
          Naršyti Produktus
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Naujausi Produktai
      </Typography>
      <Grid container spacing={4}>
        {featuredProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={3} key={`featured-${product.id}-${index}`}>
            <Card 
              className="card"
              onClick={() => navigate(`/products/${product.id}`)}
              sx={{ cursor: 'pointer' }}
            >
              <CardMedia
                component="img"
                height="140"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  {product.price} €
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Kategorijos
        </Typography>
        <Grid container spacing={3}>
          {['Elektronika', 'Drabužiai', 'Namų prekės', 'Sporto prekės'].map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category}>
              <Card 
                className="card"
                onClick={() => navigate(`/products?category=${category}`)}
                sx={{ 
                  cursor: 'pointer',
                  height: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h6">{category}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          mt: 8,
          mb: 4,
          p: 4,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          color: 'white',
          borderRadius: 2,
          textAlign: 'center',
          boxShadow: '0 3px 5px rgba(0,0,0,0.3)'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Specialūs Pasiūlymai
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
          Išskirtinės prekės su 20% nuolaida!
        </Typography>
        
        <Grid container spacing={4}>
          {products
            .filter(product => product.discount === 20)
            .map((product, index) => (
              <Grid item xs={12} sm={6} md={4} key={`discount-${product.id}-${index}-${product.name}`}>
                <Card 
                  className="card"
                  onClick={() => navigate(`/products/${product.id}`)}
                  sx={{ 
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'visible'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -15,
                      right: -15,
                      backgroundColor: 'error.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 60,
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      zIndex: 1
                    }}
                  >
                    -20%
                  </Box>
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" sx={{ color: 'text.primary' }}>
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                      <Typography 
                        variant="h6" 
                        color="error"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {(product.price * 0.8).toFixed(2)} €
                      </Typography>
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        {product.price} €
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        <Button
          variant="contained"
          color="error"
          size="large"
          onClick={() => navigate('/products')}
          sx={{ 
            mt: 4,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          Peržiūrėti visus pasiūlymus
        </Button>
      </Box>
    </Box>
  );
};

export default Home; 