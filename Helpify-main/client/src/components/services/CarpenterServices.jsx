/** @format */

import { useSelector } from 'react-redux';
import ServicesCard from './ServicesCard';

function CarpenterServices() {
  const services = useSelector((state) => state.carpenter.services);
  const name = 'Carpenter';
  return (
    <div>
      <ServicesCard services={services} name={name} />
    </div>
  );
}

export default CarpenterServices;
