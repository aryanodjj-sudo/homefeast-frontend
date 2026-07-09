import { useEffect, useState } from "react";
import { adminAPI } from "../../utils/api";
import { formatDate, formatDateTime } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";
import OrderStatusBadge from "../Orders/OrderStatusBadge";
import Loader from "../Common/Loader";
import Alert from "../Common/Alert";

// Slide-over panel showing one customer's complete order history - every
// order, every item, status and total. Opened from Manage Customers via
// "View Orders"; reuses OrderStatusBadge so status colors match everywhere else.
const CustomerOrdersDrawer = ({ customerId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await adminAPI.getCustomerOrders(customerId);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load order history");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [customerId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const orders = data?.orders || [];
  const nonCancelledOrders = orders.filter((o) => o.status !== "Cancelled");
  const totalSpent = nonCancelledOrders.reduce((sum, o) => sum + o.pricing.total, 0);
  const avgOrderValue = nonCancelledOrders.length ? totalSpent / nonCancelledOrders.length : 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl dark:bg-gray-900"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b p-6 dark:border-gray-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
              Customer Order History
            </p>
            {data?.customer ? (
              <>
                <h2 className="mt-1 text-xl font-bold">{data.customer.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{data.customer.email}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {data.customer.phone ? `${data.customer.phone} · ` : ""}
                  Joined {formatDate(data.customer.createdAt)}
                </p>
              </>
            ) : (
              <h2 className="mt-1 text-xl font-bold">Loading customer...</h2>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Stats strip */}
        {data && (
          <div className="grid grid-cols-3 gap-3 border-b p-6 dark:border-gray-800">
            <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800/50">
              <p className="text-lg font-bold">{orders.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Orders</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800/50">
              <p className="text-lg font-bold text-orange-500">{formatPrice(totalSpent)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800/50">
              <p className="text-lg font-bold">{formatPrice(avgOrderValue)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Order Value</p>
            </div>
          </div>
        )}

        {/* Order list */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && <Loader />}

          {error && <Alert type="error" message={error} />}

          {!loading && !error && orders.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
              This customer hasn&apos;t placed any orders yet.
            </p>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border p-4 dark:border-gray-800"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="mt-3 space-y-2 border-t pt-3 dark:border-gray-800">
                    {order.items.map((item, index) => (
                      <div key={`${order.id}-${index}`} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 text-sm">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t pt-3 text-sm dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </span>
                    <span className="font-bold text-orange-500">
                      {formatPrice(order.pricing.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrdersDrawer;