/** @format */

import crossIcon from '/crossIcon.png';
import moneyBagIcon from '/moneyBagIcon.png';
import SubServiceCard from '../../ui/SubServiceCard';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useOrders } from '../../context/OrdersContext';
import geyserMaintenance from '../../../public/geyserMaintenance.jpg';
import ContinueToBookingButton from './ContinueToBookingButton';
import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { debounce } from 'lodash';

function ServicesCard({ name, category }) {
  const navigate = useNavigate();
  const { ordersList } = useOrders();
  const totalQuantity = ordersList.reduce(
    (total, order) => total + order.quantity,
    0
  );
  const totalPrice = ordersList.reduce(
    (total, order) => total + order.price * order.quantity,
    0
  );

  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch services when component mounts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('Starting to fetch services...');
        console.log('Category:', category);
        console.log('API URL:', `/service?category=${category}`);

        if (!category) {
          console.error('No category provided');
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get(
          `/service?category=${category}`
        );

        console.log('Full API Response:', {
          status: response.status,
          headers: response.headers,
          data: response.data,
        });

        if (response.data && response.data.success) {
          console.log('Services received:', response.data.services);
          if (!Array.isArray(response.data.services)) {
            console.error('Services is not an array:', response.data.services);
            setServices([]);
            setFilteredServices([]);
          } else {
            setServices(response.data.services);
            setFilteredServices(response.data.services);
          }
          setTotalOrders(response.data.totalCompletedOrders || 0);
        } else {
          console.error('Invalid response format:', response.data);
          setServices([]);
          setFilteredServices([]);
          setTotalOrders(0);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config,
        });
        setServices([]);
        setFilteredServices([]);
        setTotalOrders(0);
        setLoading(false);
      }
    };

    fetchServices();
  }, [category]);

  // Debounced search function
  const debouncedSearch = debounce(async (term) => {
    try {
      if (term) {
        const response = await axiosInstance.get(
          `/service?category=${category}&search=${term}`
        );
        if (response.data && response.data.success) {
          setFilteredServices(response.data.services || []);
        } else {
          console.error('Invalid search response format:', response.data);
          setFilteredServices([]);
        }
      } else {
        setFilteredServices(services);
      }
    } catch (error) {
      console.error('Error searching services:', error.response || error);
      setFilteredServices([]);
    }
  }, 300);

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleContinue = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    navigate('/booking');
  };

  return (
    <>
      <div className="w-full min-h-screen bg-white mx-auto flex flex-col">
        {/* Header */}
        <div className="w-full max-w-[1665px] h-[85px] bg-white flex items-center justify-between flex-shrink-0 border-b border-gray-200">
          {/* Close Button */}
          <button
            className="flex flex-shrink-0 items-center justify-center w-[80px] h-[70px] sm:w-[90px] sm:h-[75px] lg:w-[106px] lg:h-[85px] border border-black bg-[rgba(217,217,217,0.05)]"
            onClick={() => navigate('/')}
          >
            <img
              src={crossIcon}
              alt="Close Page"
              className="w-[25px] h-[20px] sm:w-[35px] sm:h-[25px] lg:w-[39.31px] lg:h-[28.74px]"
            />
          </button>
          {/* Text */}
          <h1
            className="absolute left-1/2 transform -translate-x-1/2 text-[#000] text-center font-[Wix Madefor Display] text-[24px] sm:text-[30px] lg:text-[35px] font-extrabold leading-[26px] tracking-[-0.35px]"
            style={{ width: '293px' }}
          >
            <span className="flex items-center justify-center space-x-1">
              <span>Service:</span>
              <span>{name}</span>
            </span>
          </h1>
        </div>

        {/* Upper Section */}
        <div className="w-full h-auto bg-[#6472F4] flex-shrink-0 flex flex-col items-start justify-center px-8 sm:px-12 md:px-20 lg:px-36 space-y-6 md:space-y-8 py-8">
          <div>
            <div className="text-[#FFF] font-[Wix Madefor Display] sm:text-[30px] md:text-[35px] font-extrabold leading-[26px] tracking-[-0.35px]">
              {name} Services
            </div>
            <div className="text-[#FFF] font-[Wix Madefor Display] sm:text-[18px] md:text-[22px] font-extrabold leading-[26px] tracking-[-0.22px] mt-2">
              From {name} Installs, Repairs, and Upgrades – We Fix it All
            </div>
          </div>

          {/* Orders completed section */}
          <div className="w-[200px] sm:w-[220px] md:w-[246px] h-[60px] sm:h-[70px] md:h-[74px] relative flex items-center justify-center bg-[#FFFCFC]">
            <img
              src={moneyBagIcon}
              alt="Money Bag"
              className="mr-4 w-[20px] sm:w-[24px] md:w-[26px] h-[16px] sm:h-[18px] md:h-[20px]"
            />
            <div>
              <div className="text-[#0051C2] font-[Wix Madefor Display] text-[16px] sm:text-[18px] md:text-[19px] font-extrabold leading-[26px] tracking-[-0.19px]">
                {totalOrders.toLocaleString()}
              </div>
              <div className="text-[#9B9696] font-[Wix Madefor Display] text-[12px] sm:text-[13px] font-medium leading-[20px] sm:leading-[22px] md:leading-[26px] tracking-[-0.13px]">
                Orders Completed
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="w-full flex flex-col items-center justify-center mt-10 mb-20 px-4 sm:px-8">
          <div className="max-w-screen-xl h-auto bg-[#EDEDED] rounded-[20px] shadow-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-[#000] font-[Wix Madefor Display] text-[21px] font-semibold leading-[26px] tracking-[-0.21px]">
                {name} Services
              </div>
              <div className="w-full sm:w-[334px] h-[50px] sm:h-[71px] bg-[#FFF] rounded-[32px] relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search services..."
                  className="w-full h-full bg-transparent text-[#968D8D] pl-[17px] pr-[45px] font-[Wix Madefor Display] text-[16px] sm:text-[17px] font-normal leading-[26px] tracking-[-0.17px] outline-none rounded-[32px]"
                />
                <svg
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1]"></div>
              </div>
            ) : (
              /* Services Grid */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {filteredServices.map((service) => (
                  <SubServiceCard
                    key={service.id}
                    id={service.id}
                    title={service.name}
                    subtitle={service.description}
                    price={service.price}
                    image={service.image || geyserMaintenance}
                    quantity={service.quantity || 1}
                  />
                ))}
                {filteredServices.length === 0 && (
                  <div className="col-span-3 text-center py-10">
                    <p className="text-gray-500">
                      No services found matching your search.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ContinueToBookingButton />
    </>
  );
}

ServicesCard.propTypes = {
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
};

export default ServicesCard;
