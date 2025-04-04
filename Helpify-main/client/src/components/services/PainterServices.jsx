/** @format */

import React, { useState, useEffect } from 'react';
import ServicesCard from './ServicesCard';
import getAllServices from '../../api/service';

function PainterServices() {
  const [services, setServices] = useState([]); // Manage services state
  const [error, setError] = useState(null); // Manage error state if any

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const fetchedServices = await getAllServices();
        setServices(fetchedServices.services); // Assuming API returns { success: true, services: [...] }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to fetch services');
      }
    };

    fetchServices(); // Fetch data on component mount
  }, []); // Empty dependency array ensures it runs once on mount

  const name = 'Painter';

  if (error) {
    return <div>{error}</div>; // Display error if any
  }

  return (
    <div>
      {/* Render ServicesCard only when services are fetched */}
      {services.length > 0 ? (
        <ServicesCard services={services} name={name} />
      ) : (
        <p>Loading services...</p> // Loading indicator
      )}
    </div>
  );
}

export default PainterServices;
