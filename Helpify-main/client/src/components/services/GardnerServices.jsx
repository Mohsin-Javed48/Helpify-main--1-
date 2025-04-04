/** @format */

import { useSelector } from 'react-redux';
import ServicesCard from './ServicesCard';

function GardnerServices() {
  const services = useSelector((state) => state.gardner.services);
  const name = 'Gardner';
  return (
    <div>
      <ServicesCard services={services} name={name} />
    </div>
  );
}

export default GardnerServices;
