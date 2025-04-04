/** @format */

import { useSelector } from 'react-redux';
import ServicesCard from './ServicesCard';

function HandymanServices() {
  const services = useSelector((state) => state.handyman.services);
  const name = 'Handyman';
  return (
    <div>
      <ServicesCard services={services} name={name} />
    </div>
  );
}

export default HandymanServices;
