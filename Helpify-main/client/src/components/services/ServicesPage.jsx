import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrdersContext';
import { useSelector } from 'react-redux';
import { selectAllBookings } from '../../store/bookingsSlice';
import ContinueToBookingButton from './ContinueToBookingButton';

const ServiceCard = ({ title, description, icon, path, bgColor }) => (
  <Link
    to={path}
    className={`block rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 ${bgColor}`}
  >
    <div className="p-6">
      <div className="w-16 h-16 mb-4 text-white">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-white opacity-90">{description}</p>
    </div>
  </Link>
);

const ServicesPage = () => {
  const navigate = useNavigate();
  const { ordersList } = useOrders();
  const bookings = useSelector(selectAllBookings);

  const services = [
    {
      title: 'Plumbing Services',
      description: 'Expert plumbing solutions for all your needs',
      path: '/services/plumber',
      bgColor: 'bg-blue-600',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19.4 15.5a1 1 0 0 0-1.3.5 7 7 0 0 1-12.2 0 1 1 0 0 0-1.3-.5A1 1 0 0 0 4 16.8a9 9 0 0 0 16 0 1 1 0 0 0-.6-1.3ZM8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
        </svg>
      ),
    },
    {
      title: 'Electrical Services',
      description: 'Professional electrical repairs and installations',
      path: '/services/electrician',
      bgColor: 'bg-yellow-500',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 21h-1l1-7h-3.5l7-11v7h3L11 21Z" />
        </svg>
      ),
    },
    {
      title: 'Carpentry',
      description: 'Quality woodwork and furniture repairs',
      path: '/services/carpenter',
      bgColor: 'bg-amber-700',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13 17.1c0-.3.1-.5.4-.7l7.1-4.2c.2-.1.5-.1.5.1L19.5 16c-1.8 1-3.3 2.5-4.4 4.3-1.1-1.8-2.6-3.3-4.4-4.3l-1.5-3.8c0-.2.2-.2.5-.1l3 1.8c.2.1.3.5.3.2z" />
          <path d="M6.6 4.6l2.1 5.3c.1.2-.1.4-.3.4l-5.5 2.2c-.1.1-.3 0-.3-.1l1.2-3c1.4-1.2 2.3-2.9 2.8-4.8z" />
        </svg>
      ),
    },
    {
      title: 'Painting',
      description: 'Interior and exterior painting services',
      path: '/services/painter',
      bgColor: 'bg-indigo-500',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 14c-1.9 0-3.7.8-5 2.1V4.9c1.2-1.3 3-2.1 5-2.1v11.2zm-7 5.2V9.8C11.9 8.4 10.1 7.6 8 7.6v11.2c2 0 3.8.8 5 2.2z" />
        </svg>
      ),
    },
    {
      title: 'Home Appliances',
      description: 'Repair services for all home appliances',
      path: '/services/homeAppliences',
      bgColor: 'bg-red-500',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 22a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5zm1-2h12V6H6v14zm1-2h10v-1H7v1zm0-3h10v-1H7v1z" />
        </svg>
      ),
    },
    {
      title: 'Geyser Services',
      description: 'Installation and repairs for water heaters',
      path: '/services/geyser',
      bgColor: 'bg-cyan-500',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 3a7 7 0 0 0-7 7c0 1.5.5 2.8 1.4 4L12 21l5.6-7c.9-1.2 1.4-2.5 1.4-4a7 7 0 0 0-7-7zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
        </svg>
      ),
    },
    {
      title: 'Gardening Services',
      description: 'Professional gardening and landscaping',
      path: '/services/gardner',
      bgColor: 'bg-green-600',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2a5.53 5.53 0 0 0-3.5 1.3 7.48 7.48 0 0 0-3.8-.3C3.3 3.4 2 5 2 7v11h8v-2a2 2 0 0 1 4 0v2h8V7c0-2-1.3-3.6-2.7-4-1.3-.2-2.6 0-3.8.3A5.53 5.53 0 0 0 12 2zm0 2c1 0 1.9.4 2.6 1 .7.7 1.1 1.6 1.4 2.2.3.6.6 1.2 1.2 1.8 1.1 1 3.3 1 5.8 1v4.6c-1.6.2-2.5 1.3-3.3 2.2a8.2 8.2 0 0 1-3 2.2H12V16a4 4 0 0 0-8 0v3H3v-8c2.5 0 4.7 0 5.8-1 .6-.6.9-1.2 1.2-1.8.3-.6.7-1.5 1.4-2.2.7-.6 1.6-1 2.6-1z" />
        </svg>
      ),
    },
    {
      title: 'AC Repair',
      description: 'Air conditioning repair and maintenance',
      path: '/services/acRepair',
      bgColor: 'bg-sky-500',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6.59 20.3a8 8 0 0 1-4.24-4.24A2.99 2.99 0 0 0 1 13c0-1.3.84-2.4 2-2.82a8 8 0 0 1 4.24-4.24A2.99 2.99 0 0 0 8.99 3H15c1.3 0 2.4.84 2.82 2 a8 8 0 0 1 4.24 4.24A2.99 2.99 0 0 0 23 13c0 1.3-.84 2.4-2 2.82a8 8 0 0 1-4.24 4.24A2.99 2.99 0 0 0 15 22h-6c-1.3 0-2.4-.84-2.82-2zM15 20a1 1 0 0 1 1-1h2a6 6 0 0 0 3.18-3.18A1 1 0 0 1 22 15v-4a1 1 0 0 1-.82-.82A6 6 0 0 0 18 7a1 1 0 0 1-1-1V4h-2a1 1 0 0 1-.82.82A6 6 0 0 0 11 8a1 1 0 0 1-1 1H8a1 1 0 0 1-.82-.82A6 6 0 0 0 4 5a1 1 0 0 1-1 1v4a1 1 0 0 1 .82.82A6 6 0 0 0 7 14a1 1 0 0 1 1 1v2a1 1 0 0 1-.82.82A6 6 0 0 0 4 21a1 1 0 0 1 1 1h2a1 1 0 0 1 .82-.82A6 6 0 0 0 11 18a1 1 0 0 1 1-1h2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our wide range of professional home services. Add
            services to your cart and book an appointment.
          </p>

          {bookings && bookings.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => navigate('/my-bookings')}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm5 1v1h2V4H8zm-2 2v1h6V6H6zm8 0v1h2V6h-2zm0 3v1h2V9h-2zM6 9v1h6V9H6zm-2 3v1h6v-1H4zm8 0v1h4v-1h-4zm-8 3v1h4v-1H4zm8 0v1h4v-1h-4z"
                    clipRule="evenodd"
                  />
                </svg>
                View Your Bookings ({bookings.length})
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        {ordersList && ordersList.length > 0 && (
          <div className="text-center mt-12">
            <div
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              onClick={() => navigate('/booking')}
            >
              Continue with Selected Services ({ordersList.length})
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      <ContinueToBookingButton />
    </div>
  );
};

export default ServicesPage;
