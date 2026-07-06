import { Link } from "react-router-dom";
import OrderStatusBadge from "./OrderStatusBadge";
import { formatPrice } from "../../utils/formatPrice";
import { formatDate } from "../../utils/formatDate";
import { ROUTES } from "../../utils/constants";

// Summary card for a single order on the Orders list page.
// Deliberately shows only a preview of the items (not the full list) -
// the full breakdown lives on Order Details, which this links to.
const OrderCard = ({ order }) => {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const [firstItem, ...restItems] = order.items;

  return (
    <div className="rounded-2xl border p-6 dark:border-gray-700">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Order ID</p>
          <p className="font-semibold">{order.id}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <OrderStatusBadge status={order.status} />
      </div>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        {firstItem?.name}
        {restItems.length > 0 && ` and ${restItems.length} more item${restItems.length > 1 ? "s" : ""}`}
        {" "}
        <span className="text-gray-400 dark:text-gray-500">
          ({itemCount} item{itemCount > 1 ? "s" : ""})
        </span>
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4 dark:border-gray-700">
        <p className="font-semibold">
          Total: <span className="text-orange-500">{formatPrice(order.pricing.total)}</span>
        </p>

        <Link
          to={ROUTES.orderDetails(order.id)}
          className="rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;