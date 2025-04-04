/** @format */

import DateTimeSelector from '../../components/shared/DateTimeSelector';
import InformationForm from '../../components/shared/InformationForm';
import ServiceItems from '../../components/services/ServiceItems';
import OrderSummary from '../../components/orders/OrderSummary';

import { useNavigate } from 'react-router-dom';

function OrderPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col relative">
      {/* Back Button */}
      <div
        onClick={() => navigate('/services')}
        className="absolute top-0 right-0 cursor-pointer"
      >
        <svg width="76" height="68" fill="black">
          <path d="M0 0H76V68H0V0Z" />
          <path
            d="M48.5667 42.2142L37.9667 34.2485L27.3667 42.2142L25 40.4385L35.6167 32.4853L25 24.5321L27.3667 22.7563L37.9667 30.7221L48.5667 22.7689L50.9167 24.5321L40.3167 32.4853L50.9167 40.4385L48.5667 42.2142Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 mt-10 px-4">
        <div>
          <DateTimeSelector />
          <ServiceItems />
          <InformationForm />
        </div>
        <OrderSummary />
      </div>
    </div>
  );
}

export default OrderPage;
