import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button,
  TextField,
  Box
} from '@mui/material';
import { ProductContext } from '../../context/ProductContext';
import { CartContext } from '../../context/CartContext';

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { products, loading, error, fetchProducts } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get('category');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <Typography>Kraunama...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          label="Ieškoti produktų"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/products/new')}
        >
          Pridėti Naują Produktą
        </Button>
      </Box>

      {categoryFilter && (
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5">{categoryFilter}</Typography>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => navigate('/products')}
          >
            Išvalyti filtrą
          </Button>
        </Box>
      )}

      <Grid container spacing={3} className="grid-container">
        {filteredProducts.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card className="card">
              <CardMedia
                component="img"
                height="140"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  {product.price} €
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    Plačiau
                  </Button>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => {
                      const productToAdd = {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        discount: product.discount || 0,
                        stock: product.stock
                      };
                      addToCart(productToAdd);
                    }}
                  >
                    Į Krepšelį
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Products; 