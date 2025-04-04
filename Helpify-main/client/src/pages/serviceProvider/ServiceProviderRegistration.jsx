import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceProviderForm from '../../components/serviceProvider/ServiceProviderForm';
import { AuthContext } from '../../context/AuthContext';

function ServiceProviderRegistration() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(AuthContext);

  // If user is not logged in, redirect to login
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth/login');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Become a Service Provider
            </h1>
            <p className="mt-2 text-gray-600">
              Join our network of professionals and start earning by providing
              your services to customers in your area.
            </p>
          </div>

          {isLoggedIn && user ? (
            <ServiceProviderForm />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p>Please log in to register as a service provider.</p>
              <button
                onClick={() => navigate('/auth/login')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceProviderRegistration;
