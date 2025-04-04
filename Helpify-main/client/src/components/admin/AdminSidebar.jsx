import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUsers,
  faUserTie,
  faClipboardList,
  faExclamationCircle,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { clearUser } from '../../utills/user';

function AdminSidebar() {
  const handleLogout = () => {
    clearUser();
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen w-64 bg-gray-900 text-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">HELPIFY</h1>
        <h2 className="text-sm text-gray-400 mb-6">Admin Dashboard</h2>
      </div>

      <nav className="mt-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <FontAwesomeIcon icon={faHome} className="w-5 h-5 mr-3" />
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/customers"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <FontAwesomeIcon icon={faUsers} className="w-5 h-5 mr-3" />
              Customers
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/service-providers"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <FontAwesomeIcon icon={faUserTie} className="w-5 h-5 mr-3" />
              Service Providers
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <FontAwesomeIcon
                icon={faClipboardList}
                className="w-5 h-5 mr-3"
              />
              Orders
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/complaints"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="w-5 h-5 mr-3"
              />
              Complaints
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="absolute bottom-0 w-64 p-4 bg-gray-900">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 rounded"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
