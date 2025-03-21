import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Alert,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { OrderContext } from '../../context/OrderContext';
import { ProductContext } from '../../context/ProductContext';

const OrderCreate = () => {
  const navigate = useNavigate();
  const { createOrder } = useContext(OrderContext);
  const { products } = useContext(ProductContext);
  const [error, setError] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('shipping.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleProductSelect = (product) => {
    if (product) {
      const existingProduct = selectedProducts.find(p => p.id === product.id);
      if (existingProduct) {
        setSelectedProducts(prev =>
          prev.map(p =>
            p.id === product.id
              ? { ...p, quantity: p.quantity + 1 }
              : p
          )
        );
      } else {
        setSelectedProducts(prev => [
          ...prev,
          { ...product, quantity: 1 }
        ]);
      }
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setSelectedProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, quantity: newQuantity }
          : p
      )
    );
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.filter(p => p.id !== productId)
    );
  };

  const calculateTotal = () => {
    return selectedProducts.reduce(
      (total, product) => total + (product.price * product.quantity),
      0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.customerName || !formData.customerEmail) {
      setError('Vardas ir el. paštas yra privalomi');
      return;
    }

    if (selectedProducts.length === 0) {
      setError('Pridėkite bent vieną produktą');
      return;
    }

    try {
      const orderData = {
        ...formData,
        items: selectedProducts.map(product => ({
          productId: product.id,
          quantity: product.quantity,
          price: product.price
        })),
        totalAmount: calculateTotal(),
        status: 'pending',
        date: new Date().toISOString()
      };

      await createOrder(orderData);
      navigate('/orders');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Naujas Užsakymas</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/orders')}
        >
          Atšaukti
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Produktai
              </Typography>
              <Autocomplete
                options={products}
                getOptionLabel={(option) => option.name}
                onChange={(_, value) => handleProductSelect(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Pridėti produktą"
                    margin="normal"
                  />
                )}
              />

              <TableContainer sx={{ mt: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Produktas</TableCell>
                      <TableCell align="right">Kaina</TableCell>
                      <TableCell align="right">Kiekis</TableCell>
                      <TableCell align="right">Suma</TableCell>
                      <TableCell align="right">Veiksmai</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell align="right">{product.price} €</TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            value={product.quantity}
                            onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                            size="small"
                            sx={{ width: 80 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {(product.price * product.quantity).toFixed(2)} €
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleRemoveProduct(product.id)}
                          >
                            Pašalinti
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="subtitle1">Bendra suma:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" color="primary">
                          {calculateTotal().toFixed(2)} €
                        </Typography>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Kliento Informacija
              </Typography>
              <TextField
                fullWidth
                label="Vardas"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="El. Paštas"
                name="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Telefonas"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                margin="normal"
              />

              <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
                Pristatymo Adresas
              </Typography>
              <TextField
                fullWidth
                label="Gatvė"
                name="shipping.street"
                value={formData.shippingAddress.street}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Miestas"
                name="shipping.city"
                value={formData.shippingAddress.city}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Pašto Kodas"
                name="shipping.postalCode"
                value={formData.shippingAddress.postalCode}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Šalis"
                name="shipping.country"
                value={formData.shippingAddress.country}
                onChange={handleChange}
                margin="normal"
                required
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
              >
                Sukurti Užsakymą
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default OrderCreate; 