/** @format */

import OrdersForConfirm from '../orders/OrdersForConfirm';

function ServiceItems() {
  return (
    <div className="rounded-lg">
      <h2 className="text-black font-wixmadefor text-[26px] font-semibold">
        Items:
      </h2>
      <div className="border px-4 pb-8">
        <h1 className="mb-10 text-black font-wixmadefor text-[22px] font-semibold">
          Plumber:
        </h1>
        <OrdersForConfirm />
      </div>
      <div className="flex justify-center gap-4">
        <button className="bg-[#FA0C57] py-3 px-6 rounded-lg text-white">
          Emergency
        </button>
        <button className="bg-[#1EE100] py-3 px-6 rounded-lg text-white">
          Search Provider
        </button>
      </div>
    </div>
  );
}

export default ServiceItems;
