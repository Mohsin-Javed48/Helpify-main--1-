import { createContext, useState, useEffect } from 'react';
import { clearUser, getUser, setUser as storeUser } from '../utills/user';
import { me } from '../api/auth';
import axiosInstance from '../api/axios';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jwt, setJwt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const updateUserData = async (token) => {
    try {
      console.log('Updating user data with token:', token);
      const response = await me(token);
      console.log('User data response:', response);

      if (!response || !response.user) {
        throw new Error('Invalid user data received');
      }

      const userData = {
        ...response.user,
        token: token,
      };

      console.log('Setting user data:', userData);
      setUser(userData);
      storeUser(userData);
      setIsLoggedIn(true);
      setJwt(token);

      return userData;
    } catch (error) {
      console.error('Error updating user data:', error);
      clearUser();
      setIsLoggedIn(false);
      setJwt(null);
      setUser(null);
      throw error;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = getUser();
        console.log('Stored user:', storedUser);

        if (storedUser?.token) {
          try {
            const userData = await updateUserData(storedUser.token);
            console.log('User data updated successfully:', userData);
          } catch (error) {
            console.error('Error refreshing user data:', error);
            clearUser();
            setIsLoggedIn(false);
            setJwt(null);
            setUser(null);
          }
        } else {
          console.log('No stored user found');
          clearUser();
          setIsLoggedIn(false);
          setJwt(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        clearUser();
        setIsLoggedIn(false);
        setJwt(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const login = async (token, userData) => {
    try {
      console.log('Logging in with token:', token);
      const updatedUser = await updateUserData(token);
      console.log('Login successful, user data:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out');
    clearUser();
    setIsLoggedIn(false);
    setJwt(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        jwt,
        isLoading,
        user,
        login,
        logout,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
