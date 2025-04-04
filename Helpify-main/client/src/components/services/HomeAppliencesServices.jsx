/** @format */

import { useSelector } from 'react-redux';
import ServicesCard from './ServicesCard';

function HomeAppliencesServices() {
  const services = useSelector((state) => state.homeAppliences.services);
  const name = 'Home Appliences';
  return (
    <div>
      <ServicesCard services={services} name={name} />
    </div>
  );
}

export default HomeAppliencesServices;
