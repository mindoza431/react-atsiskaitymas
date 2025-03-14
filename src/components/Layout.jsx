import { Box } from '@mui/material';
import Navbar from './layout/Navbar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      width: '100vw',
      maxWidth: '100vw',
      overflow: 'hidden'
    }}>
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flex: 1,
          width: '100%',
          p: 3,
          boxSizing: 'border-box'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 