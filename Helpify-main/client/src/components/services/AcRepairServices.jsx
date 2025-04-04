/** @format */

import { useServices } from '../../context/ServicesContext';
import ServicesCard from './ServicesCard';

function AcRepairServices() {
  const { acRepairServices } = useServices();
  const name = 'AcRepair';
  return (
    <div>
      <ServicesCard services={acRepairServices} name={name} />
    </div>
  );
}

export default AcRepairServices;
