/** @format */

import { useSelector } from 'react-redux';
import ServicesCard from './ServicesCard';

function ElectricianServices() {
  const services = useSelector((state) => state.electrician.services);
  const name = 'Electrician';
  return (
    <div>
      <ServicesCard services={services} name={name} />
    </div>
  );
}

export default ElectricianServices;
