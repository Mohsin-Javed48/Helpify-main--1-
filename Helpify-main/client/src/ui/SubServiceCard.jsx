/** @format */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useOrders } from '../context/OrdersContext';
import geyserMaintenance from '../../public/geyserMaintenance.jpg';

function SubServiceCard({
  id,
  title = 'Default Title',
  subtitle = 'Default Subtitle',
  price = '0',
  image = 'https://via.placeholder.com/100',
  quantity = '1',
}) {
  const { addOrder } = useOrders();
  const [imgError, setImgError] = useState(false);

  function addOrderItem() {
    const newOrder = {
      id,
      title,
      subtitle,
      price: Number(price),
      image: imgError ? geyserMaintenance : image,
      quantity: Number(quantity),
    };
    addOrder(newOrder);
  }
  console.log('image', image);

  return (
    <div className="w-full sm:max-w-[360px] h-auto bg-[#FFF] rounded-[30px] flex-shrink-0 flex flex-wrap sm:flex-nowrap items-center p-4 sm:p-6 gap-4">
      <div
        className="w-[100px] sm:w-[117px] h-[100px] sm:h-[117px] flex-shrink-0 bg-lightgray bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        <img src={image} alt={title} className="hidden" />
      </div>

      <div className="flex flex-col flex-grow text-center sm:text-left space-y-2 sm:space-y-1">
        <h3 className="text-[#000] font-[Wix Madefor Display] text-[18px] sm:text-[21px] font-semibold leading-[24px] sm:leading-[26px] tracking-[-0.21px]">
          {title}
        </h3>
        <p className="text-[#AAA0A0] font-[Wix Madefor Display] text-[16px] sm:text-[18px] font-medium leading-[20px] sm:leading-[22px] tracking-[-0.2px]">
          {subtitle}
        </p>
        <p className="text-[#000] font-[Wix Madefor Display] text-[14px] sm:text-[15px] font-normal">
          Rs {price}
        </p>

        <div
          className="flex items-center justify-center sm:justify-start w-[120px] h-[41px] border border-black rounded-sm mx-auto sm:mx-0 cursor-pointer"
          onClick={addOrderItem}
        >
          <div className="flex-1 flex items-center justify-center text-[#000] font-[Wix Madefor Display] text-[18px] sm:text-[20px] font-semibold">
            ADD
          </div>
          <div className="flex items-center justify-center w-[37px] h-[41px] bg-[#1400AD]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="#FFF"
            >
              <path d="M18.583 10.333H10.833V18.583H7.25V10.333H0V7.75H7.25V0H10.833V7.75H18.583V10.333Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// Prop validation using PropTypes
SubServiceCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  image: PropTypes.string,
  quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default SubServiceCard;
