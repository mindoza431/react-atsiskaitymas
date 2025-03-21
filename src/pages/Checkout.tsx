import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  Divider,
  Alert
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useUser } from '../context/UserContext';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, getTotal, clearCart } = useCart();
  const { createOrder } = useOrder();
  const { currentUser } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: '',
    postalCode: ''
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (items.length === 0 && !location.state?.fromProduct) {
      navigate('/cart');
    }
  }, [items, location.state, navigate, currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!currentUser) {
        throw new Error('Turite prisijungti, kad galėtumėte atlikti užsakymą');
      }

      if (items.length === 0) {
        throw new Error('Jūsų krepšelis tuščias');
      }

      const orderData = {
        userId: currentUser.id,
        customerName: formData.name,
        items,
        totalAmount: getTotal(),
        status: 'pending' as const,
        shippingDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        },
        date: new Date().toISOString()
      };

      await createOrder(orderData);
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Įvyko klaida bandant atlikti užsakymą');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  if (items.length === 0) {
    return (
      <Container>
        <Box py={4}>
          <Alert severity="info">
            Jūsų krepšelis tuščias. Pirmiausia pridėkite prekių į krepšelį.
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Naršyti Produktus
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Užsakymo Patvirtinimas
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Pristatymo Informacija
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Vardas"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="El. paštas"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Telefono numeris"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Miestas"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Adresas"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Pašto kodas"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Užsakymo Santrauka
              </Typography>
              <Box sx={{ mb: 2 }}>
                {items.map((item) => (
                  <Box key={item.id} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      {item.name} x {item.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(item.price * item.quantity).toFixed(2)} €
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">
                  Viso: {getTotal().toFixed(2)} €
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Apdorojama...' : 'Patvirtinti Užsakymą'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Checkout; 