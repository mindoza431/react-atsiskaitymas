import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getItemTotal, getCartTotal } = useContext(CartContext);
  const { currentUser } = useContext(UserContext);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, parseInt(newQuantity));
  };

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate('/orders/new');
  };

  if (cartItems.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h5" gutterBottom>
          Jūsų krepšelis tuščias
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Grįžti į Parduotuvę
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Krepšelis
      </Typography>

      {!currentUser && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Norėdami užbaigti užsakymą, turite prisijungti
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
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
                {cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                              marginRight: 10
                            }}
                          />
                        )}
                        <Typography>{item.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {item.discount ? (
                        <Box>
                          <Typography
                            variant="body2"
                            color="error"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {item.discountedPrice.toFixed(2)} €
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textDecoration: 'line-through' }}
                          >
                            {item.originalPrice.toFixed(2)} €
                          </Typography>
                        </Box>
                      ) : (
                        `${item.price.toFixed(2)} €`
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        size="small"
                        sx={{ width: 80 }}
                        inputProps={{ min: 1 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {getItemTotal(item).toFixed(2)} €
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/products')}
            >
              Tęsti Apsipirkimą
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => clearCart()}
            >
              Išvalyti Krepšelį
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Užsakymo Suvestinė
            </Typography>
            
            <Box sx={{ my: 2 }}>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography>Prekių kiekis:</Typography>
                </Grid>
                <Grid item>
                  <Typography>
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
                <Grid item>
                  <Typography>Pristatymas:</Typography>
                </Grid>
                <Grid item>
                  <Typography>Nemokamai</Typography>
                </Grid>
              </Grid>

              <Grid
                container
                justifyContent="space-between"
                sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}
              >
                <Grid item>
                  <Typography variant="h6">Bendra suma:</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6" color="primary">
                    {getCartTotal().toFixed(2)} €
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleCheckout}
              sx={{ mt: 2 }}
            >
              {currentUser ? 'Pereiti prie Apmokėjimo' : 'Prisijungti ir Tęsti'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Cart; 