import { ORDER_STATUS } from "../../utils/constants";

const STATUS_STYLES = {
  [ORDER_STATUS.PLACED]: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  [ORDER_STATUS.CONFIRMED]: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
  [ORDER_STATUS.PREPARING]: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  [ORDER_STATUS.OUT_FOR_DELIVERY]: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  [ORDER_STATUS.DELIVERED]: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  [ORDER_STATUS.CANCELLED]: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const OrderStatusBadge = ({ status }) => (
  <span
    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
      STATUS_STYLES[status] || "bg-gray-100 text-gray-700"
    }`}
  >
    {status}
  </span>
);

export default OrderStatusBadge;