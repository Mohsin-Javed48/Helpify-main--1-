import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const { isLoggedIn, user } = useContext(AuthContext);

{
  isLoggedIn && user && user.roleId === 3 && (
    <li className="nav-item">
      <Link
        to="/become-provider"
        className="nav-link text-blue-500 hover:text-blue-700"
      >
        Become a Service Provider
      </Link>
    </li>
  );
}
