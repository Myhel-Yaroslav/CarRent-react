import { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoadingAuth(true);
      axios.get('/api/user')
        .then(res => {
          setUser(res.data);
        })
        .catch((error) => {
          console.error("Auth check error", error);
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
          }
          setUser(null);
        })
        .finally(() => {
          setIsLoadingAuth(false);
        });
    } else {
      setIsLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem('token');
      setUser(null);
    };
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      if (localStorage.getItem('token')) {
        await axios.post('/api/logout');
      }
    } catch (error) {
      console.error(error);
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  const returnCar = (reservationId) => {
    if (user && user.reservations) {
      const updatedReservations = user.reservations.map(res => 
        res.id === reservationId ? { ...res, status: 'completed' } : res
      );
      setUser({ ...user, reservations: updatedReservations });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoadingAuth, login, logout, returnCar }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
