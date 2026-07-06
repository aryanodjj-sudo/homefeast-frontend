import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ordersAPI } from "../../utils/api";
import { formatDateTime } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";
import { ORDER_STATUS_FLOW, ORDER_STATUS, ROUTES } from "../../utils/constants";
import Loader from "../../components/Common/Loader";
import Alert from "../../components/Common/Alert";
import OrderStatusBadge from "../../components/Orders/OrderStatusBadge";

const FILTERS = ["All", ...ORDER_STATUS_FLOW, ORDER_STATUS.CANCELLED];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await ordersAPI.getAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    setError(null);

    try {
      const updated = await ordersAPI.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err) {
      setError(err.message || "Could not update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const visibleOrders = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Orders</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {orders.length} order{orders.length !== 1 ? "s" : ""} total
      </p>

      {error && (
        <div className="mt-4">
          <Alert type="error" message={error} />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === status
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border bg-white dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Update</th>
            </tr>
          </thead>
          <tbody>
            {visibleOrders.map((order) => (
              <tr key={order.id} className="border-b last:border-0 dark:border-gray-800">
                <td className="px-4 py-3">
                  <Link to={ROUTES.orderDetails(order.id)} className="font-medium text-orange-500 hover:underline">
                    {order.id}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {order.address.fullName}
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {formatDateTime(order.createdAt)}
                </td>
                <td className="px-4 py-3 font-medium">{formatPrice(order.pricing.total)}</td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  {order.status === ORDER_STATUS.CANCELLED ? (
                    <span className="text-xs text-gray-400">—</span>
                  ) : (
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      className="rounded-lg border border-gray-300 px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-900"
                    >
                      {ORDER_STATUS_FLOW.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}

            {visibleOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">
                  No orders match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;