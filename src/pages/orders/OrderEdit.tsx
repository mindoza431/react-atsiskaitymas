import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Alert
} from '@mui/material';
import { OrderContext } from '../../context/OrderContext';

const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedOrder, loading, error, getOrderById, updateOrderStatus } = useContext(OrderContext);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    status: '',
    shippingAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    }
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      await getOrderById(id);
    };
    loadOrder();
  }, [id]);

  useEffect(() => {
    if (selectedOrder) {
      setFormData({
        customerName: selectedOrder.customerName,
        customerEmail: selectedOrder.customerEmail,
        customerPhone: selectedOrder.customerPhone,
        status: selectedOrder.status,
        shippingAddress: {
          street: selectedOrder.shippingAddress.street,
          city: selectedOrder.shippingAddress.city,
          postalCode: selectedOrder.shippingAddress.postalCode,
          country: selectedOrder.shippingAddress.country
        }
      });
    }
  }, [selectedOrder]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      await updateOrderStatus(id, formData.status);
      navigate(`/orders/${id}`);
    } catch (err) {
      setFormError(err.message);
    }
  };

  if (loading) return <Typography>Kraunama...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!selectedOrder) return <Typography>Užsakymas nerastas</Typography>;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Redaguoti Užsakymą</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(`/orders/${id}`)}
        >
          Atšaukti
        </Button>
      </Box>

      {formError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {formError}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
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
              />
              <TextField
                fullWidth
                label="El. Paštas"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Telefonas"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                select
                label="Statusas"
                name="status"
                value={formData.status}
                onChange={handleChange}
                margin="normal"
              >
                <MenuItem value="pending">Laukiama</MenuItem>
                <MenuItem value="processing">Vykdoma</MenuItem>
                <MenuItem value="completed">Įvykdyta</MenuItem>
                <MenuItem value="cancelled">Atšaukta</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Pristatymo Adresas
              </Typography>
              <TextField
                fullWidth
                label="Gatvė"
                name="shipping.street"
                value={formData.shippingAddress.street}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Miestas"
                name="shipping.city"
                value={formData.shippingAddress.city}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Pašto Kodas"
                name="shipping.postalCode"
                value={formData.shippingAddress.postalCode}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Šalis"
                name="shipping.country"
                value={formData.shippingAddress.country}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Išsaugoti Pakeitimus
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default OrderEdit; 