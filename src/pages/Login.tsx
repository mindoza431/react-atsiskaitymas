import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Link,
  CircularProgress
} from '@mui/material';
import { useUser } from '../context/UserContext';

interface LocationState {
  from?: string;
}

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, fetchUsers, currentUser, users } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [redirecting, setRedirecting] = useState(false);

  console.log('Login - currentUser:', currentUser);
  console.log('Login - location:', location);

  useEffect(() => {
    console.log('Login - useEffect - tikriname, ar uzkrauna vartotojus');
 
    if (!currentUser && users.length === 0) {
      console.log('Login - useEffect - užkraunami vartotojai');
      fetchUsers();
    } else {
      console.log('Login - useEffect - vartotojai jau užkrauti');
    }
  }, []);

  useEffect(() => {
    if (currentUser && !redirecting) {
      console.log('Login - useEffect - currentUser - nukreipiama į pagrindinį puslapį');
      setRedirecting(true);
      const redirectTo = (location.state as LocationState)?.from || '/';
      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 100);
    }
  }, [currentUser, navigate, location, redirecting]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Login - handleSubmit - formData:', formData);

    if (!formData.email || !formData.password) {
      setError('El. paštas ir slaptažodis yra privalomi');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Login - handleSubmit - bandoma prisijungti');
      await login(formData.email, formData.password);
      console.log('Login - handleSubmit - prisijungta sėkmingai');
      setRedirecting(true);
    } catch (error) {
      console.error('Login - handleSubmit - prisijungimo klaida:', error);
      setError('Neteisingas el. paštas arba slaptažodis');
      setIsLoading(false);
    }
  };

  if (redirecting) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Nukreipiama...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}
    >
      <Paper
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Prisijungimas
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="El. Paštas"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            disabled={isLoading}
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
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={isLoading}
          >
            {isLoading ? 'Jungiamasi...' : 'Prisijungti'}
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Neturite paskyros?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/register')}
              >
                Registruotis
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login; 