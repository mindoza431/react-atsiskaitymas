import { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { UserContext } from '../../context/UserContext';
import { OrderContext } from '../../context/OrderContext';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedUser, loading, error, getUserById } = useContext(UserContext);
  const { orders } = useContext(OrderContext);

  useEffect(() => {
    getUserById(id);
  }, [id]);

  const userOrders = orders.filter(order => order.userId === id);

  if (loading) return <Typography>Kraunama...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!selectedUser) return <Typography>Vartotojas nerastas</Typography>;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Vartotojo Informacija</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/users')}
          >
            Grįžti į Sąrašą
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate(`/users/${id}/edit`)}
          >
            Redaguoti
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pagrindinė Informacija
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">ID</Typography>
                <Typography>{selectedUser.id}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Vardas</Typography>
                <Typography>{selectedUser.name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">El. Paštas</Typography>
                <Typography>{selectedUser.email}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Rolė</Typography>
                <Chip
                  label={selectedUser.role}
                  color={selectedUser.role === 'admin' ? 'primary' : 'default'}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Registracijos Data</Typography>
                <Typography>
                  {new Date(selectedUser.registrationDate).toLocaleDateString('lt-LT')}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Kontaktinė Informacija
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Telefonas</Typography>
                <Typography>{selectedUser.phone || '-'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Adresas</Typography>
                <Typography>{selectedUser.address || '-'}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Užsakymų Istorija
            </Typography>
            {userOrders.length > 0 ? (
              <List>
                {userOrders.map((order) => (
                  <ListItem
                    key={order.id}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <ListItemText
                      primary={`Užsakymas #${order.id}`}
                      secondary={`Data: ${new Date(order.date).toLocaleDateString('lt-LT')} | Suma: ${order.totalAmount} €`}
                    />
                    <Chip
                      label={order.status}
                      color={
                        order.status === 'completed' ? 'success' :
                        order.status === 'pending' ? 'warning' :
                        order.status === 'cancelled' ? 'error' : 'default'
                      }
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="textSecondary">
                Vartotojas dar neturi užsakymų
              </Typography>
            )}
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Aktyvumas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Paskutinis Prisijungimas</Typography>
                <Typography>
                  {selectedUser.lastLogin
                    ? new Date(selectedUser.lastLogin).toLocaleDateString('lt-LT')
                    : '-'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Užsakymų Skaičius</Typography>
                <Typography>{userOrders.length}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Išleista Suma</Typography>
                <Typography>
                  {userOrders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)} €
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Statusas</Typography>
                <Chip
                  label={selectedUser.isActive ? 'Aktyvus' : 'Neaktyvus'}
                  color={selectedUser.isActive ? 'success' : 'error'}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDetails; 