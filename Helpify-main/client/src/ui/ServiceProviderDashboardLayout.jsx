import Header from './Header';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import {
  faHome,
  faListAlt,
  faWallet,
  faBell,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { clearUser } from '../utills/user';

function ServiceProviderDashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    clearUser();
    window.location.href = '/auth/login';
  };

  // Mobile Sidebar Component
  const MobileSidebar = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
      <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-bold">HELPIFY</h1>
          <button onClick={toggleSidebar} className="text-gray-500">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-4">
          <h2 className="text-gray-500 mb-4">Service Provider Dashboard</h2>

          <ul className="space-y-2">
            <li>
              <NavLink
                to="/provider/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded ${
                    isActive ? 'bg-[#2ED6A326] text-black' : 'text-gray-600'
                  }`
                }
                onClick={toggleSidebar}
                end
              >
                <FontAwesomeIcon icon={faHome} className="text-[#00B074]" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/provider/orderlist"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded ${
                    isActive ? 'bg-[#2ED6A326] text-black' : 'text-gray-600'
                  }`
                }
                onClick={toggleSidebar}
              >
                <FontAwesomeIcon icon={faListAlt} className="text-[#464255]" />
                Order List
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/provider/wallet"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded ${
                    isActive ? 'bg-[#2ED6A326] text-black' : 'text-gray-600'
                  }`
                }
                onClick={toggleSidebar}
              >
                <FontAwesomeIcon icon={faWallet} className="text-[#464255]" />
                Wallet
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/provider/notification"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded ${
                    isActive ? 'bg-[#2ED6A326] text-black' : 'text-gray-600'
                  }`
                }
                onClick={toggleSidebar}
              >
                <FontAwesomeIcon icon={faBell} className="text-[#464255]" />
                Notification
              </NavLink>
            </li>
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  toggleSidebar();
                }}
                className="flex items-center gap-2 p-2 text-gray-600 hover:text-blue-500 w-full text-left"
              >
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  className="text-[#464255]"
                />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      {isSidebarOpen && <MobileSidebar />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F3F2F7]">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ServiceProviderDashboardLayout;
