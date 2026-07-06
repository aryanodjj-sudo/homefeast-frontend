import { createContext, useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { ordersAPI } from "../utils/api";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  // Reads AuthContext directly (rather than via useAuth) because OrderProvider
  // renders inside AuthProvider - this keeps orders scoped to whoever is
  // currently logged in without needing prop drilling.
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    if (!user?.id) {
      setOrders([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await ordersAPI.getOrders(user.id);
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Re-fetch whenever the logged-in user changes (login, logout, switch user).
  // This is a standard "fetch on mount / on dependency change" data effect;
  // the setState calls happen inside the async loadOrders after an await,
  // not synchronously during render.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders();
  }, [loadOrders]);

  // items/address/paymentMethod/pricing/coupon are assembled by the Checkout
  // page; this just persists them and keeps local state in sync so Orders
  // page reflects the new order immediately without a refetch.
  const placeOrder = async ({ items, address, paymentMethod, pricing, coupon }) => {
    if (!user?.id) {
      throw new Error("You must be logged in to place an order");
    }

    const newOrder = await ordersAPI.placeOrder({
      userId: user.id,
      items,
      address,
      paymentMethod,
      pricing,
      coupon,
    });

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const cancelOrder = async (orderId) => {
    const updatedOrder = await ordersAPI.cancelOrder(orderId);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
    return updatedOrder;
  };

  const getOrderById = (orderId) => orders.find((o) => o.id === orderId);

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        placeOrder,
        cancelOrder,
        getOrderById,
        refreshOrders: loadOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;