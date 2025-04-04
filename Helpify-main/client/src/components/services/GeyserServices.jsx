/** @format */

import { useSelector } from 'react-redux';
import ServicesCard from './ServicesCard';

function GeyserServices() {
  const services = useSelector((state) => state.geyser.services);
  const name = 'Geyser';
  return (
    <div>
      <ServicesCard services={services} name={name} />
    </div>
  );
}

export default GeyserServices;
