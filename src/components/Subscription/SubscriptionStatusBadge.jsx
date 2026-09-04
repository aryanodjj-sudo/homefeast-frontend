import { SUBSCRIPTION_STATUS } from "../../utils/constants";

const STATUS_STYLES = {
  [SUBSCRIPTION_STATUS.ACTIVE]: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  [SUBSCRIPTION_STATUS.PAUSED]: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  [SUBSCRIPTION_STATUS.CANCELLED]: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  [SUBSCRIPTION_STATUS.EXPIRED]: "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400",
};

const SubscriptionStatusBadge = ({ status }) => (
  <span
    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
      STATUS_STYLES[status] || "bg-gray-100 text-gray-700"
    }`}
  >
    {status}
  </span>
);

export default SubscriptionStatusBadge;