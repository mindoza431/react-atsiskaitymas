import { useContext, useEffect, useState } from 'react';
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
  TextField
} from '@mui/material';
import { OrderContext } from '../../context/OrderContext';

const Orders = () => {
  const navigate = useNavigate();
  const { orders, loading, error, fetchOrders, updateOrderStatus } = useContext(OrderContext);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
  };

  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchTerm) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Typography>Kraunama...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Užsakymai</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/orders/new')}
        >
          Naujas Užsakymas
        </Button>
      </Box>

      <TextField
        label="Ieškoti pagal užsakymo ID arba kliento vardą"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

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
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString('lt-LT')}</TableCell>
                <TableCell>{order.totalAmount} €</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    onClick={() => {
                      const newStatus = order.status === 'pending' ? 'processing' : 'completed';
                      handleStatusChange(order.id, newStatus);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      Peržiūrėti
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/orders/${order.id}/edit`)}
                    >
                      Redaguoti
                    </Button>
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