import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useOrders from "../hooks/useOrders";
import Loader from "../components/Common/Loader";
import Alert from "../components/Common/Alert";
import Modal from "../components/Common/Modal";
import OrderStatusBadge from "../components/Orders/OrderStatusBadge";
import OrderTracker from "../components/Orders/OrderTracker";
import PriceBreakdown from "../components/Checkout/PriceBreakdown";
import { formatPrice } from "../utils/formatPrice";
import { formatDate } from "../utils/formatDate";
import { ordersAPI } from "../utils/api";
import { PAYMENT_METHOD_LABELS, ROUTES, ORDER_STATUS } from "../utils/constants";

// Single order's full detail view: status tracker, line items, delivery
// address, payment method, price breakdown, and (while still cancellable)
// a cancel-order action. Reuses OrderTracker/OrderStatusBadge/PriceBreakdown
// rather than re-implementing any of that UI.
const OrderDetails = () => {
  const { id } = useParams();
  const { getOrderById, cancelOrder, loading } = useOrders();
  const contextOrder = getOrderById(id);

  // Not found in the logged-in user's own order list? That's expected for
  // admins viewing a customer's order (their own order list is unrelated) -
  // fall back to fetching it directly. The backend already allows admins to
  // view any order; only customers are restricted to their own.
  const [fetchedOrder, setFetchedOrder] = useState(null);
  const [fetchingOrder, setFetchingOrder] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (contextOrder || loading) return;

    let cancelled = false;
    setFetchingOrder(true);
    setFetchError(null);

    ordersAPI
      .getOrderById(id)
      .then((data) => {
        if (!cancelled) setFetchedOrder(data);
      })
      .catch((err) => {
        if (!cancelled) setFetchError(err.message || "Order not found");
      })
      .finally(() => {
        if (!cancelled) setFetchingOrder(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, contextOrder, loading]);

  const order = contextOrder || fetchedOrder;

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  if ((loading || fetchingOrder) && !order) {
    return <Loader />;
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">
          {fetchError || "Order not found"}
        </h1>
        <Link to={ROUTES.ORDERS} className="mt-4 inline-block text-orange-500 hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const isCancellable = canCancelOrder(order.status);

  const handleConfirmCancel = async () => {
    setCancelError(null);
    setCancelling(true);

    try {
      await cancelOrder(order.id);
      setShowCancelConfirm(false);
    } catch (err) {
      setCancelError(err.message || "Could not cancel order. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <Link to={ROUTES.ORDERS} className="text-sm text-gray-500 hover:text-orange-500">
        ← Back to Orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{order.id}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {cancelError && (
        <div className="mt-4">
          <Alert type="error" message={cancelError} />
        </div>
      )}

      <div className="mt-8 rounded-2xl border p-6 dark:border-gray-700">
        <OrderTracker status={order.status} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border p-6 dark:border-gray-700">
            <h2 className="text-xl font-bold">Items ({order.items.length})</h2>
            <div className="mt-4 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-orange-500">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  {order.status === ORDER_STATUS.DELIVERED && (
                    <Link
                      to={ROUTES.mealDetails(item.mealId || item.id)}
                      className="ml-2 shrink-0 rounded-lg border border-orange-500 px-3 py-1.5 text-xs font-semibold text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10"
                    >
                      ⭐ Rate this meal
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-6 dark:border-gray-700">
            <h2 className="text-xl font-bold">Delivery Address</h2>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              <p className="font-semibold text-gray-900 dark:text-white">
                {order.address.fullName}
              </p>
              <p>{order.address.phone}</p>
              <p className="mt-2">
                {order.address.addressLine1}
                {order.address.addressLine2 ? `, ${order.address.addressLine2}` : ""}
              </p>
              <p>
                {order.address.city}, {order.address.state} - {order.address.pincode}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border p-6 dark:border-gray-700">
            <h2 className="text-xl font-bold">Payment Method</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <PriceBreakdown
            pricing={order.pricing}
            couponCode={order.coupon}
            actionSlot={
              isCancellable ? (
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(true)}
                  className="mt-6 w-full rounded-xl border border-red-500 px-4 py-3 text-center font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  Cancel Order
                </button>
              ) : null
            }
          />
        </div>
      </div>

      {showCancelConfirm && (
        <Modal close={() => setShowCancelConfirm(false)}>
          <h2 className="text-xl font-bold">Cancel this order?</h2>
          <p className="mt-2 max-w-xs text-sm text-gray-500 dark:text-gray-400">
            This action cannot be undone. Your order will be marked as
            cancelled.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowCancelConfirm(false)}
              className="rounded-xl border px-4 py-2 font-medium dark:border-gray-700"
            >
              Keep Order
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              disabled={cancelling}
              className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancelling ? "Cancelling..." : "Yes, Cancel"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrderDetails;