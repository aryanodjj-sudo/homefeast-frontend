import { Link } from "react-router-dom";
import useOrders from "../hooks/useOrders";
import OrderCard from "../components/Orders/OrderCard";
import Loader from "../components/Common/Loader";
import Alert from "../components/Common/Alert";
import { ROUTES } from "../utils/constants";

// Full order history for the logged-in user. OrderContext already loads
// orders scoped to the current user and keeps them fresh on login/logout,
// so this page only needs to render whatever state it hands back.
const Orders = () => {
  const { orders, loading, error } = useOrders();

  if (loading && orders.length === 0) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Your Orders</h1>

      {error && (
        <div className="mt-4">
          <Alert type="error" message={error} />
        </div>
      )}

      {!loading && orders.length === 0 ? (
        <div className="mt-10 rounded-2xl border py-16 text-center dark:border-gray-700">
          <h2 className="text-xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            When you place an order, it will show up here.
          </p>
          <Link
            to={ROUTES.MENU}
            className="mt-6 inline-block rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;