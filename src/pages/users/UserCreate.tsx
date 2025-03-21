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
  MenuItem,
  FormControlLabel,
  Switch
} from '@mui/material';
import { UserContext } from '../../context/UserContext';

const UserCreate = () => {
  const navigate = useNavigate();
  const { createUser } = useContext(UserContext);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'user',
    isActive: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Vardas, el. paštas ir slaptažodis yra privalomi');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Neteisingas el. pašto formatas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Slaptažodis turi būti bent 6 simbolių ilgio');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Slaptažodžiai nesutampa');
      return;
    }

    try {
      const userData = {
        ...formData,
        registrationDate: new Date().toISOString()
      };
      delete userData.confirmPassword;

      await createUser(userData);
      navigate('/users');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Naujas Vartotojas</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/users')}
        >
          Atšaukti
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Pagrindinė Informacija
              </Typography>
              <TextField
                fullWidth
                label="Vardas"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="El. Paštas"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Slaptažodis"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Pakartoti Slaptažodį"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                select
                label="Rolė"
                name="role"
                value={formData.role}
                onChange={handleChange}
                margin="normal"
              >
                <MenuItem value="user">Vartotojas</MenuItem>
                <MenuItem value="admin">Administratorius</MenuItem>
                <MenuItem value="manager">Vadybininkas</MenuItem>
              </TextField>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleSwitchChange}
                    name="isActive"
                    color="primary"
                  />
                }
                label="Aktyvus vartotojas"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Kontaktinė Informacija
              </Typography>
              <TextField
                fullWidth
                label="Telefonas"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Adresas"
                name="address"
                value={formData.address}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
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
              Sukurti Vartotoją
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default UserCreate; 