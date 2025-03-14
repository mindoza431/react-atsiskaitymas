import { createContext, useReducer, useEffect } from 'react';

export const UserContext = createContext();

const API_URL = 'http://localhost:3001';

const getSavedUser = () => {
  try {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error('Klaida gaunant vartotoją iš localStorage:', error);
    return null;
  }
};

const initialState = {
  users: [],
  loading: false,
  error: null,
  currentUser: getSavedUser(),
  selectedUser: null
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_USERS_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_USERS_SUCCESS':
      return {
        ...state,
        loading: false,
        users: action.payload
      };
    case 'FETCH_USERS_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload
      };
    case 'SET_SELECTED_USER':
      return {
        ...state,
        selectedUser: action.payload
      };
    case 'CREATE_USER':
      return {
        ...state,
        users: [...state.users, action.payload]
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        )
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [state.currentUser]);

  const fetchUsers = async () => {
    if (state.users.length > 0) {
      console.log('UserContext - fetchUsers - vartotojai jau užkrauti:', state.users.length);
      return state.users;
    }

    console.log('UserContext - fetchUsers - užkraunami vartotojai');
    dispatch({ type: 'FETCH_USERS_START' });
    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) throw new Error('Nepavyko gauti vartotojų');
      const data = await response.json();
      console.log('UserContext - fetchUsers - gauti vartotojai:', data.length);
      dispatch({ type: 'FETCH_USERS_SUCCESS', payload: data });
      return data;
    } catch (error) {
      console.error('UserContext - fetchUsers - klaida:', error);
      dispatch({ type: 'FETCH_USERS_ERROR', payload: error.message });
      return [];
    }
  };

  const login = async (credentials) => {
    try {
      console.log('Bandoma prisijungti su:', credentials);
      
      let user = state.users.find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      
      console.log('Rasti vartotojai:', state.users);
      console.log('Rastas vartotojas:', user);
      
      if (!user) {
        console.log('Vartotojas nerastas, bandoma gauti iš API');
        await fetchUsers();
        
        user = state.users.find(
          u => u.email === credentials.email && u.password === credentials.password
        );
        
        console.log('Vartotojai po užkrovimo:', state.users);
        console.log('Rastas vartotojas po užkrovimo:', user);
      }
      
      if (!user) {
        console.log('Vartotojas nerastas');
        throw new Error("Neteisingi prisijungimo duomenys");
      }

      console.log('Nustatomas currentUser:', user);
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      
      return user;
    } catch (error) {
      console.error('Prisijungimo klaida:', error);
      dispatch({ type: 'FETCH_USERS_ERROR', payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    console.log('Atsijungiama...');
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    localStorage.removeItem('currentUser');
  };

  const getUserById = async (id) => {
    try {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      
      const existingUser = state.users.find(u => u.id === numericId);
      if (existingUser) {
        dispatch({ type: 'SET_SELECTED_USER', payload: existingUser });
        return existingUser;
      }
      
      const response = await fetch(`${API_URL}/users/${numericId}`);
      if (!response.ok) throw new Error('Vartotojas nerastas');
      const user = await response.json();
      dispatch({ type: 'SET_SELECTED_USER', payload: user });
      return user;
    } catch (error) {
      dispatch({ type: 'FETCH_USERS_ERROR', payload: error.message });
      return null;
    }
  };

  const createUser = async (userData) => {
    try {
      const existingUser = state.users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error("Vartotojas su tokiu el. paštu jau egzistuoja");
      }

      const newUser = {
        ...userData,
        role: userData.role || "user",
        isActive: true,
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      });
      
      if (!response.ok) throw new Error('Nepavyko sukurti vartotojo');
      const createdUser = await response.json();
      
      dispatch({ type: 'CREATE_USER', payload: createdUser });
      return createdUser;
    } catch (error) {
      dispatch({ type: 'FETCH_USERS_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      
      const response = await fetch(`${API_URL}/users/${numericId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) throw new Error('Nepavyko atnaujinti vartotojo');
      const updatedUser = await response.json();
      
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      return updatedUser;
    } catch (error) {
      dispatch({ type: 'FETCH_USERS_ERROR', payload: error.message });
      return null;
    }
  };

  const deleteUser = async (id) => {
    try {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      
      const response = await fetch(`${API_URL}/users/${numericId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Nepavyko ištrinti vartotojo');
      
      dispatch({ type: 'DELETE_USER', payload: numericId });
      return true;
    } catch (error) {
      dispatch({ type: 'FETCH_USERS_ERROR', payload: error.message });
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        error: state.error,
        currentUser: state.currentUser,
        selectedUser: state.selectedUser,
        fetchUsers,
        login,
        logout,
        getUserById,
        createUser,
        updateUser,
        deleteUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
}; 