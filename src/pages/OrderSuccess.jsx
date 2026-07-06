import { Link, useParams } from "react-router-dom";
import useOrders from "../hooks/useOrders";
import Loader from "../components/Common/Loader";
import { formatPrice } from "../utils/formatPrice";
import { ROUTES } from "../utils/constants";

const OrderSuccess = () => {
  const { id } = useParams();
  const { getOrderById, loading } = useOrders();
  // Derived straight from context state on every render - orders already
  // lives in OrderContext, so there's no need to mirror it into local state.
  const order = getOrderById(id);

  if (loading && !order) return <Loader />;

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <Link to={ROUTES.ORDERS} className="mt-4 inline-block text-orange-500 hover:underline">
          View your orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col items-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl dark:bg-green-500/10">
        ✓
      </div>
      <h1 className="mt-4 text-3xl font-bold">Order Placed Successfully!</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Thank you, {order.address.fullName}. Your order has been confirmed.
      </p>

      <div className="mt-6 w-full max-w-md rounded-2xl border p-6 text-left dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Order ID</span>
          <span className="font-semibold">{order.id}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-gray-500">Total Paid</span>
          <span className="font-semibold text-orange-500">{formatPrice(order.pricing.total)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-gray-500">Delivering to</span>
          <span className="text-right font-medium">
            {order.address.city}, {order.address.state}
          </span>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          to={ROUTES.orderDetails(order.id)}
          className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Track Order
        </Link>
        <Link
          to={ROUTES.MENU}
          className="rounded-xl border px-5 py-3 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;