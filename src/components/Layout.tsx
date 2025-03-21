import { Box, Container } from '@mui/material';
import Navbar from './layout/Navbar';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
    }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: '84px',
          pb: 3,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Container 
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            margin: '0 auto',
            px: { xs: 2, sm: 3 }
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 