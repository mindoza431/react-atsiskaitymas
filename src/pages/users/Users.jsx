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
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { UserContext } from '../../context/UserContext';

const Users = () => {
  const navigate = useNavigate();
  const { users, loading, error, fetchUsers, deleteUser } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    console.log('Users - useEffect - patikraine ar uzkrauna varototjus');
    if (users.length === 0) {
      console.log('Users - useEffect - užkraunami vartotojai');
      fetchUsers();
    } else {
      console.log('Users - useEffect - vartotojai jau užkrauti:', users.length);
    }
  }, []);

  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(selectedUserId);
      setDeleteDialogOpen(false);
      setSelectedUserId(null);
    } catch (error) {
      console.error('Klaida trinant vartotoją:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Typography>Kraunama...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Vartotojai</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/users/new')}
        >
          Naujas Vartotojas
        </Button>
      </Box>

      <TextField
        label="Ieškoti pagal vardą arba el. paštą"
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
              <TableCell>ID</TableCell>
              <TableCell>Vardas</TableCell>
              <TableCell>El. Paštas</TableCell>
              <TableCell>Rolė</TableCell>
              <TableCell>Registracijos Data</TableCell>
              <TableCell>Veiksmai</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {new Date(user.registrationDate).toLocaleDateString('lt-LT')}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/users/${user.id}`)}
                    >
                      Peržiūrėti
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/users/${user.id}/edit`)}
                    >
                      Redaguoti
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(user.id)}
                    >
                      Ištrinti
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Patvirtinti ištrynimą</DialogTitle>
        <DialogContent>
          Ar tikrai norite ištrinti šį vartotoją? Šio veiksmo negalėsite atšaukti.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Atšaukti
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Ištrinti
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users; 