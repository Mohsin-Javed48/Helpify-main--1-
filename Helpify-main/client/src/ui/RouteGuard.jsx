import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router';

function RouteGuard({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, isLoading, user } = useContext(AuthContext);

  // Handle redirects based on authentication state
  useEffect(() => {
    // Don't do anything while auth state is loading
    if (isLoading) return;

    // If user is NOT logged in and trying to access a protected route, redirect to login
    if (!isLoggedIn && !location.pathname.startsWith('/auth/')) {
      navigate('/auth/login', { replace: true });
      return;
    }

    // If logged in and trying to access an auth route, redirect to appropriate dashboard
    if (isLoggedIn && location.pathname.startsWith('/auth/')) {
      if (!user) return; // Wait for user data to be available

      const roleRedirects = {
        1: '/admin',
        2: '/provider',
        3: '/',
      };

      const redirectPath = roleRedirects[user.roleId];
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      }
    }
  }, [isLoggedIn, isLoading, location.pathname, user, navigate]);

  // Show a loading indicator while checking auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // If user is not logged in and trying to access a protected route,
  // we return null here because the redirect happens in the useEffect
  if (!isLoggedIn && !location.pathname.startsWith('/auth/')) {
    return null;
  }

  // Allow unauthenticated users to access auth routes (e.g., login, register)
  if (!isLoggedIn && location.pathname.startsWith('/auth/')) {
    return children;
  }

  // If logged in and trying to access an auth route,
  // we return null here because the redirect happens in the useEffect
  if (isLoggedIn && location.pathname.startsWith('/auth/')) {
    if (!user) return null; // Wait for user data to be available
    // We'll show a loading state while the redirect happens in useEffect
    return null;
  }

  return children;
}

export default RouteGuard;
