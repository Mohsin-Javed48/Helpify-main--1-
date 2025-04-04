/** @format */

import { useSelector } from 'react-redux';
import OrdersForConfirmCard from './OrdersForConfirmCard';

function OrdersForConfirm() {
  const ordersList = useSelector((state) => state.orders.ordersList);

  return (
    <div>
      {ordersList.length === 0 ? (
        <p>No items in the order list.</p>
      ) : (
        ordersList.map((order) => (
          <OrdersForConfirmCard key={order.id} order={order} />
        ))
      )}
    </div>
  );
}

export default OrdersForConfirm;
