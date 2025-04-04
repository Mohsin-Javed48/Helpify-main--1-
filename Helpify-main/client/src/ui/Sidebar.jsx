import { NavLink } from 'react-router-dom';
import { clearUser } from '../utills/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faListAlt,
  faWallet,
  faBell,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
  const handleLogout = () => {
    clearUser();
    window.location.href = '/auth/login';
  };

  return (
    <div className="hidden md:block bg-[#fff] shadow-lg py-4 px-6 lg:py-6 lg:px-8 min-h-screen">
      <div className="flex flex-col justify-between h-full">
        <div>
          <h1 className="font-poppins text-[20px] sm:text-[30px] md:text-[35px] font-bold leading-normal">
            HELPIFY
          </h1>
          <h2
            className="mb-[15px] lg:mb-[25px] text-[#B9BBBD] text-[18px] font-medium leading-normal"
            style={{ fontFamily: 'Barlow, sans-serif' }}
          >
            Service Provider Dashboard
          </h2>
          <ul
            className="text-[#464255] space-y-[15px] md:space-y-[20px] text-[16px] md:text-[18px] font-medium leading-[32px] md:leading-[40px]"
            style={{ fontFamily: 'Barlow, sans-serif' }}
          >
            <li className="gap-3 text-gray-600 hover:text-blue-500 cursor-pointer">
              <NavLink
                to="/provider/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded ${
                    isActive ? 'bg-[#2ED6A326] text-[black]' : 'bg-[white]'
                  }`
                }
                end
              >
                <FontAwesomeIcon icon={faHome} className="text-[#00B074]" />
                Dashboard
              </NavLink>
            </li>
            <li className="gap-3 text-gray-600 hover:text-blue-500 cursor-pointer">
              <NavLink
                to="/provider/orderlist"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded ${
                    isActive ? 'bg-[#2ED6A326] text-[black]' : ''
                  }`
                }
              >
                <FontAwesomeIcon icon={faListAlt} className="text-[#464255]" />
                Order List
              </NavLink>
            </li>

            <li className="gap-3 text-gray-600 hover:text-blue-500 cursor-pointer">
              <NavLink
                to="/provider/wallet"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded ${
                    isActive ? 'bg-[#2ED6A326] text-[black]' : ''
                  }`
                }
              >
                <FontAwesomeIcon icon={faWallet} className="text-[#464255]" />
                Wallet
              </NavLink>
            </li>
            <li className="gap-3 text-gray-600 hover:text-blue-500 cursor-pointer">
              <NavLink
                to="/provider/notification"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded ${
                    isActive ? 'bg-[#2ED6A326] text-[black]' : ''
                  }`
                }
              >
                <FontAwesomeIcon icon={faBell} className="text-[#464255]" />
                Notification
              </NavLink>
            </li>

            <li className="text-gray-600 hover:text-blue-500 cursor-pointer">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 hover:text-blue-500 w-full text-left"
                aria-label="Logout"
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
        <div className="mt-8">
          <h1
            className="mb-[5px] text-[#969BA0] text-[12px] md:text-[13px] font-bold leading-[18px]"
            style={{ fontFamily: 'Barlow, sans-serif' }}
          >
            HELPIFY Service Provider Dashboard
          </h1>
          <h2
            className="mb-[10px] text-[#969BA0] text-[12px] md:text-[13px] font-bold leading-[18px]"
            style={{ fontFamily: 'Barlow, sans-serif' }}
          >
            © 2024 All Rights Reserved
          </h2>
          <h1
            className="text-[#969BA0] text-[12px] md:text-[14px] font-normal leading-[26px]"
            style={{ fontFamily: 'Barlow, sans-serif' }}
          >
            Made with ❤ by Helpify
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
