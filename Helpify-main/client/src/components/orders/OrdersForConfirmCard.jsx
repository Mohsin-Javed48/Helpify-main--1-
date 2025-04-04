/** @format */

import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

function OrdersForConfirmCard({ order }) {
  return (
    <div className="w-full sm:max-w-[360px] h-auto bg-[#FFF] rounded-[30px] flex-shrink-0 flex flex-wrap sm:flex-nowrap items-center p-4 sm:p-6 gap-4 border border-custom-gray">
      {/* Image Section */}
      <div
        className="w-[100px] sm:w-[117px] h-[100px] sm:h-[117px] flex-shrink-0 bg-lightgray bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${order.image})`,
        }}
      ></div>

      {/* Text Section */}
      <div className="flex flex-col flex-grow text-center sm:text-left space-y-2 sm:space-y-1">
        <h3 className="text-[#000] font-[Wix Madefor Display] text-[18px] sm:text-[21px] font-semibold leading-[24px] sm:leading-[26px] tracking-[-0.21px]">
          {order.title}
        </h3>
        <p className="text-[#AAA0A0] font-[Wix Madefor Display] text-[16px] sm:text-[18px] font-medium leading-[20px] sm:leading-[22px] tracking-[-0.2px]">
          {order.subtitle}
        </p>
        <p className="text-[#000] font-[Wix Madefor Display] text-[14px] sm:text-[15px] font-normal">
          Rs {order.price} x {order.quantity}
        </p>

        {/* Add Button Section */}
        <div
          className="flex items-center justify-center sm:justify-start w-[120px] h-[41px] border border-black rounded-sm mx-auto sm:mx-0"
          onClick={handleRemove}
        >
          {/* Text Section */}
          <div className="flex-1 flex items-center justify-center text-[#000] font-[Wix Madefor Display] text-[18px] sm:text-[20px] font-semibold">
            Remove
          </div>
          {/* Plus Button */}
          <div className="flex items-center justify-center w-[37px] h-[41px] bg-[#1400AD]">
            {/* Plus Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="#FFF"
            >
              <path d="M0 8.25H18.583V10.75H0V8.25Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

OrdersForConfirmCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default OrdersForConfirmCard;
