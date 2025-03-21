import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { User } from '../../types';
import styles from './Users.module.css';

export const Users = () => {
  const navigate = useNavigate();
  const { users, loading, error, fetchUsers, deleteUser } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = useCallback(async (id: number) => {
    if (window.confirm('Ar tikrai norite ištrinti šį vartotoją?')) {
      try {
        await deleteUser(id);
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  }, [deleteUser]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setSelectedUser(user);
  }, []);

  const filteredUsers = users.filter((user: User) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Kraunama...</div>;
  if (error) return <div>Klaida: {error}</div>;

  return (
    <div className={styles.usersContainer}>
      <h2>Vartotojai</h2>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Ieškoti vartotojų..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className={styles.usersList}>
        {filteredUsers.map((user: User) => (
          <div key={user.id} className={styles.userCard}>
            <h3>{user.name}</h3>
            <p>El. paštas: {user.email}</p>
            <p>Rolė: {user.role}</p>
            <div className={styles.actions}>
              <button onClick={() => handleEditUser(user)}>Redaguoti</button>
              <button onClick={() => handleDelete(user.id)}>Ištrinti</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 