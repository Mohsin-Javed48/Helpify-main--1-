import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAllBookings } from '../../store/bookingsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const BookingDropdownMenu = ({ navStyles }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const bookings = useSelector(selectAllBookings);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <li className="relative">
      <span
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="cursor-pointer flex items-center gap-1"
      >
        Bookings
        {bookings.length > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full ml-1">
            {bookings.length}
          </span>
        )}
        <FontAwesomeIcon icon={faChevronDown} className="text-white" />
      </span>
      {isDropdownOpen && (
        <ul className={navStyles.dropdown} ref={dropdownRef}>
          <li className={navStyles.dropdownItem}>
            <NavLink to="/booking" className="block">
              New Booking
            </NavLink>
          </li>
          <li className={navStyles.dropdownItem}>
            <NavLink to="/my-bookings" className="block">
              My Bookings
              {bookings.length > 0 && (
                <span className="inline-flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-5 px-1 ml-2">
                  {bookings.length}
                </span>
              )}
            </NavLink>
          </li>
        </ul>
      )}
    </li>
  );
};

export default BookingDropdownMenu;
