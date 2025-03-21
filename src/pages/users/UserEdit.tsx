import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Alert,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import { UserContext } from '../../context/UserContext';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedUser, loading, error, getUserById, updateUser } = useContext(UserContext);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    isActive: true
  });

  useEffect(() => {
    const loadUser = async () => {
      await getUserById(id);
    };
    loadUser();
  }, [id]);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone || '',
        address: selectedUser.address || '',
        role: selectedUser.role,
        isActive: selectedUser.isActive
      });
    }
  }, [selectedUser]);

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
    setFormError('');

    if (!formData.name || !formData.email) {
      setFormError('Vardas ir el. paštas yra privalomi');
      return;
    }

    if (!validateEmail(formData.email)) {
      setFormError('Neteisingas el. pašto formatas');
      return;
    }

    try {
      await updateUser(id, formData);
      navigate(`/users/${id}`);
    } catch (err) {
      setFormError(err.message);
    }
  };

  if (loading) return <Typography>Kraunama...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!selectedUser) return <Typography>Vartotojas nerastas</Typography>;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Redaguoti Vartotoją</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(`/users/${id}`)}
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
              Išsaugoti Pakeitimus
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default UserEdit; 