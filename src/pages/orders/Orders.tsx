import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Chip,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { useOrder } from '../../context/OrderContext';
import { useUser } from '../../context/UserContext';
import { Order } from '../../types';

const Orders = () => {
  const navigate = useNavigate();
  const { orders, loading, error, fetchOrders, updateOrderStatus } = useOrder();
  const { currentUser } = useUser();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [fetchOrders, currentUser, navigate]);

  const getStatusColor = useCallback((status: Order['status']) => {
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
  }, []);

  const handleStatusChange = useCallback(async (orderId: number, newStatus: Order['status']) => {
    if (currentUser?.role !== 'admin') return;
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  }, [updateOrderStatus, currentUser]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleNewOrder = useCallback(() => {
    navigate('/checkout');
  }, [navigate]);

  const handleViewOrder = useCallback((orderId: number) => {
    navigate(`/orders/${orderId}`);
  }, [navigate]);

  const handleEditOrder = useCallback((orderId: number) => {
    if (currentUser?.role !== 'admin') return;
    navigate(`/orders/${orderId}/edit`);
  }, [navigate, currentUser]);

  const filteredOrders = orders.filter((order: Order) => {
    if (currentUser?.role !== 'admin') {
      return order.userId === currentUser?.id;
    }
    return order.id.toString().includes(searchTerm) ||
           order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!currentUser) return null;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => fetchOrders()}
        >
          Bandyti dar kartą
        </Button>
      </Box>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Užsakymai</Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Jūs dar neturite užsakymų
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/products')}
        >
          Naršyti Produktus
        </Button>
      </Box>
    );
  }

  return (
    <div>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Užsakymai</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNewOrder}
        >
          Naujas Užsakymas
        </Button>
      </Box>

      {currentUser.role === 'admin' && (
        <TextField
          label="Ieškoti pagal užsakymo ID arba kliento vardą"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
        />
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Užsakymo ID</TableCell>
              <TableCell>Klientas</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Suma</TableCell>
              <TableCell>Statusas</TableCell>
              <TableCell>Veiksmai</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order: Order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString('lt-LT')}</TableCell>
                <TableCell>{order.totalAmount.toFixed(2)} €</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    onClick={() => currentUser.role === 'admin' && handleStatusChange(order.id, order.status === 'pending' ? 'processing' : 'completed')}
                    sx={{ cursor: currentUser.role === 'admin' ? 'pointer' : 'default' }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      onClick={() => handleViewOrder(order.id)}
                    >
                      Peržiūrėti
                    </Button>
                    {currentUser.role === 'admin' && (
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleEditOrder(order.id)}
                      >
                        Redaguoti
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Orders; 