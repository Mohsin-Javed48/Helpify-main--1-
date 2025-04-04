/** @format */

import React, { useState, useEffect } from 'react';
import ServicesCard from './ServicesCard';
import getServicesByCategory from '../../api/service';

function PlumberServices() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching plumber services...');

        const data = await getServicesByCategory('plumber');
        console.log('Received services data:', data);

        if (Array.isArray(data)) {
          setServices(data);
        } else {
          console.error('Invalid data format received:', data);
          setError('Invalid data format received');
          setServices([]);
        }
      } catch (error) {
        console.error('Error fetching plumber services:', error);
        setError('Failed to fetch services');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const name = 'Plumber';
  const category = 'plumber';

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white mx-auto flex flex-col items-center justify-center">
        <div className="text-xl">Loading services...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-white mx-auto flex flex-col items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return <ServicesCard name={name} category={category} />;
}

export default PlumberServices;
