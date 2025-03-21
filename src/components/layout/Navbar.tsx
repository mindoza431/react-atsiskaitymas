import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Badge, Container } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';

const Navbar = () => {
  const { items: cartItems } = useCart();
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        boxShadow: '0 3px 5px rgba(0,0,0,0.3)',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Container maxWidth="lg">
        <Toolbar 
          sx={{ 
            px: { xs: 2, sm: 4 },
            minHeight: 64,
            display: 'flex',
            justifyContent: 'space-between',
            boxSizing: 'border-box'
          }}
        >
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
              fontSize: { xs: '1.1rem', sm: '1.3rem' },
              minWidth: '150px'
            }}
          >
            E-Parduotuvė
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 3 }, 
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center'
          }}>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Pagrindinis
            </Button>
            
            <Button
              color="inherit"
              component={RouterLink}
              to="/products"
            >
              Produktai
            </Button>

            {currentUser && (
              <Button
                color="inherit"
                component={RouterLink}
                to="/orders"
              >
                Užsakymai
              </Button>
            )}

            {currentUser?.role === 'admin' && (
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/users"
              >
                Vartotojai
              </Button>
            )}
          </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 2 }, 
            alignItems: 'center',
            minWidth: '150px',
            justifyContent: 'flex-end'
          }}>
            <Button 
              color="inherit"
              component={RouterLink}
              to="/cart"
              sx={{ 
                minWidth: 'auto',
                px: { xs: 1, sm: 2 }
              }}
            >
              <Badge 
                badgeContent={cartItems?.length || 0} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    right: -3,
                    top: 3,
                  }
                }}
              >
                <ShoppingCartIcon />
              </Badge>
            </Button>

            {!currentUser ? (
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                variant="outlined"
                sx={{ 
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Prisijungti
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  color="inherit"
                  sx={{ 
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  {currentUser.name}
                </Button>
                <Button 
                  color="inherit"
                  variant="outlined"
                  onClick={handleLogout}
                  sx={{ 
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Atsijungti
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 