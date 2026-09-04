import { useEffect, useState } from "react";
import { subscriptionAPI } from "../../utils/api";
import { formatPrice } from "../../utils/formatPrice";
import { formatDate } from "../../utils/formatDate";
import { SUBSCRIPTION_STATUS, MEAL_PREFERENCE_LABELS } from "../../utils/constants";
import SubscriptionStatusBadge from "../../components/Subscription/SubscriptionStatusBadge";
import Loader from "../../components/Common/Loader";
import Alert from "../../components/Common/Alert";

const STATUS_OPTIONS = Object.values(SUBSCRIPTION_STATUS);

const ManageSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    try {
      const data = await subscriptionAPI.getAllSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError(err.message || "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    try {
      const updated = await subscriptionAPI.updateSubscriptionStatus(id, status);
      setSubscriptions((prev) =>
        prev.map((s) => ((s.id || s._id) === id ? { ...s, status: updated.status } : s))
      );
    } catch (err) {
      setError(err.message || "Could not update subscription");
    } finally {
      setBusyId(null);
    }
  };

  const revenue = subscriptions
    .filter((s) => s.status !== SUBSCRIPTION_STATUS.CANCELLED)
    .reduce((sum, s) => sum + s.price, 0);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Subscriptions</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {subscriptions.length} subscription{subscriptions.length !== 1 ? "s" : ""} total.
      </p>

      {error && (
        <div className="mt-4">
          <Alert type="error" message={error} />
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Subscriptions</p>
          <p className="mt-1 text-2xl font-bold">{subscriptions.length}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {subscriptions.filter((s) => s.status === SUBSCRIPTION_STATUS.ACTIVE).length}
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Subscription Revenue</p>
          <p className="mt-1 text-2xl font-bold text-orange-500">{formatPrice(revenue)}</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border bg-white dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Preference</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Start</th>
              <th className="px-4 py-3">End</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => {
              const id = sub.id || sub._id;
              const customer = sub.userId; // populated { name, email, phone } from backend

              return (
                <tr key={id} className="border-b last:border-0 dark:border-gray-800">
                  <td className="px-4 py-3">
                    <p className="font-medium">{customer?.name || "—"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {customer?.email || ""}
                    </p>
                  </td>
                  <td className="px-4 py-3 capitalize">{sub.plan}</td>
                  <td className="px-4 py-3">{MEAL_PREFERENCE_LABELS[sub.mealPreference]}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(sub.price)}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {formatDate(sub.startDate)}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {formatDate(sub.endDate)}
                  </td>
                  <td className="px-4 py-3">
                    <SubscriptionStatusBadge status={sub.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={sub.status}
                      onChange={(e) => handleStatusChange(id, e.target.value)}
                      disabled={busyId === id}
                      className="rounded-lg border border-gray-300 px-2 py-1.5 text-xs disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}

            {subscriptions.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">
                  No subscriptions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSubscriptions;