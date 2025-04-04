import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faUser } from '@fortawesome/free-solid-svg-icons';

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center">
          {/* Hamburger menu for mobile */}
          <button
            className="md:hidden text-gray-700 mr-4"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>

          {/* Page title could go here */}
          <h1 className="text-xl font-semibold md:hidden">Helpify</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notification bell */}
          <Link
            to="/provider/notification"
            className="text-gray-700 hover:text-blue-600"
          >
            <FontAwesomeIcon icon={faBell} size="lg" />
          </Link>

          {/* User dropdown */}
          <div className="relative group">
            <button className="flex items-center text-gray-700 hover:text-blue-600">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user?.name?.charAt(0) || <FontAwesomeIcon icon={faUser} />}
              </div>
              <span className="ml-2 hidden sm:block">
                {user?.name || 'User'}
              </span>
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
              <Link
                to="/provider/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                to="/provider/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
