import { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider
} from '@mui/material';
import { OrderContext } from '../../context/OrderContext';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedOrder, loading, error, getOrderById, updateOrderStatus } = useContext(OrderContext);

  useEffect(() => {
    getOrderById(id);
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleStatusChange = async (newStatus) => {
    await updateOrderStatus(id, newStatus);
  };

  if (loading) return <Typography>Kraunama...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!selectedOrder) return <Typography>Užsakymas nerastas</Typography>;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Užsakymo Detalės</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/orders')}
          >
            Grįžti į Sąrašą
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate(`/orders/${id}/edit`)}
          >
            Redaguoti
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Užsakymo Informacija
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Užsakymo ID</Typography>
                <Typography>{selectedOrder.id}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Data</Typography>
                <Typography>
                  {new Date(selectedOrder.date).toLocaleDateString('lt-LT')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Statusas</Typography>
                <Chip
                  label={selectedOrder.status}
                  color={getStatusColor(selectedOrder.status)}
                  onClick={() => {
                    const newStatus = selectedOrder.status === 'pending' ? 'processing' : 'completed';
                    handleStatusChange(newStatus);
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Bendra Suma</Typography>
                <Typography variant="h6" color="primary">
                  {selectedOrder.totalAmount} €
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Užsakyti Produktai
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Produktas</TableCell>
                    <TableCell align="right">Kiekis</TableCell>
                    <TableCell align="right">Kaina</TableCell>
                    <TableCell align="right">Suma</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedOrder.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.price} €</TableCell>
                      <TableCell align="right">
                        {(item.quantity * item.price).toFixed(2)} €
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Kliento Informacija
            </Typography>
            <Typography variant="subtitle2">Vardas</Typography>
            <Typography gutterBottom>{selectedOrder.customerName}</Typography>
            
            <Typography variant="subtitle2">El. Paštas</Typography>
            <Typography gutterBottom>{selectedOrder.customerEmail}</Typography>
            
            <Typography variant="subtitle2">Telefonas</Typography>
            <Typography gutterBottom>{selectedOrder.customerPhone}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Pristatymo Adresas
            </Typography>
            <Typography>
              {selectedOrder.shippingAddress.street}<br />
              {selectedOrder.shippingAddress.city}<br />
              {selectedOrder.shippingAddress.postalCode}<br />
              {selectedOrder.shippingAddress.country}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetails; 