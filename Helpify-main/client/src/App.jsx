/** @format */

import './index.css';
import { useRoutes } from 'react-router';
import app_routes from './app_routes';
import { AuthContext } from './context/AuthContext';
import { useContext, useEffect } from 'react';
import { clearUser, getUser, setUser as storeUser } from './utills/user';
import { AnimatePresence } from 'framer-motion';
import AnimatedRoute from './components/Layout/AnimateRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setAuthToken } from './api/axios';
import { me } from './api/auth';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function App() {
  const queryClient = new QueryClient();
  const routing = useRoutes(app_routes);
  const { user, setUser, isLoading, setIsLoading } = useContext(AuthContext);

  const fetchUserData = async () => {
    try {
      if (setIsLoading) {
        setIsLoading(true);
      }

      const userData = getUser();

      if (!userData) {
        console.log('No user data found in storage');
        if (setIsLoading) {
          setIsLoading(false);
        }
        return;
      }

      console.log('User data from storage:', userData);
      const token = userData.token;

      if (!token) {
        console.log('No token found in user data');
        if (setIsLoading) {
          setIsLoading(false);
        }
        return;
      }

      // Set token for API requests
      setAuthToken(token);

      // Fetch user profile from API
      try {
        const response = await me(token);
        console.log('User data from API:', response.user);

        if (response && response.user) {
          const updatedUserData = {
            ...response.user,
            token: token,
          };
          if (setUser) {
            setUser(updatedUserData);
          }
          storeUser(updatedUserData);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        clearUser();
      }
    } catch (error) {
      console.error('Error in fetch user data:', error);
      clearUser();
    } finally {
      if (setIsLoading) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence mode="wait">
        <AnimatedRoute>{routing}</AnimatedRoute>
      </AnimatePresence>
    </QueryClientProvider>
  );
}

export default App;
