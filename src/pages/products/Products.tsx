import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useProduct } from '../../context/ProductContext';
import { Product } from '../../types';
import ProductCard from '../../components/products/ProductCard';
import { Container, Grid, TextField, Box, Typography, Alert, CircularProgress } from '@mui/material';

export const Products = () => {
  const location = useLocation();
  const { products, loading, error, fetchProducts } = useProduct();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get('category');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={4}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ieškoti produktų..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 2 }}
        />
        {categoryFilter && (
          <Typography variant="h6" gutterBottom>
            Kategorija: {categoryFilter}
          </Typography>
        )}
      </Box>
      
      {filteredProducts.length === 0 ? (
        <Box display="flex" justifyContent="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            Produktų nerasta
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}; 