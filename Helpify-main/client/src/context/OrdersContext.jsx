import { createContext, useState, useContext } from 'react';

const OrdersContext = createContext();

function OrdersProvider({ children }) {
  const [ordersList, setOrdersList] = useState([]);

  const addOrder = (newOrder) => {
    setOrdersList((prevOrders) => [...prevOrders, newOrder]);
  };

  const updateOrder = (id, updatedOrder) => {
    setOrdersList((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, ...updatedOrder } : order
      )
    );
  };

  const removeOrder = (id) => {
    setOrdersList((prevOrders) =>
      prevOrders.filter((order) => order.id !== id)
    );
  };

  const clearOrders = () => {
    setOrdersList([]);
  };

  const ordersValue = {
    ordersList,
    addOrder,
    updateOrder,
    removeOrder,
    clearOrders,
  };

  return (
    <OrdersContext.Provider value={ordersValue}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext);
export { OrdersProvider, OrdersContext };
