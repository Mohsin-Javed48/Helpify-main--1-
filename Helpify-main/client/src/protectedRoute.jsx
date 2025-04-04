import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  // console.log('ProtectedRoute User:', JSON.stringify(user, null, 2)); // Print user object properly

  if (user === null) {
    return <p>Loading...</p>;
  }

  if (!allowedRoles.includes(user?.roleId)) {
    console.log('dennnnnnnnnnied');
    if (user?.roleId === 1) {
      navigate('/admin', { replace: true });
    } else if (user?.roleId === 2) {
      navigate('/provider', { replace: true });
    } else if (user?.roleId === 3) {
      navigate('/', { replace: true });
    }
  }

  return children;
};

export default ProtectedRoute;
