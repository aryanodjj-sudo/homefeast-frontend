import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import { subscriptionAPI } from "../utils/api";
import { formatPrice } from "../utils/formatPrice";
import { formatDate } from "../utils/formatDate";
import { SUBSCRIPTION_STATUS, MEAL_PREFERENCE_LABELS, SUBSCRIPTION_PLANS, ROUTES } from "../utils/constants";
import SubscriptionStatusBadge from "../components/Subscription/SubscriptionStatusBadge";
import Loader from "../components/Common/Loader";
import Alert from "../components/Common/Alert";

const MySubscriptions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const load = async () => {
    try {
      const data = await subscriptionAPI.getMySubscriptions(user.id);
      setSubscriptions(data);
    } catch (err) {
      setError(err.message || "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this subscription? Daily deliveries will stop.")) return;
    setCancellingId(id);
    try {
      const updated = await subscriptionAPI.cancelSubscription(id);
      setSubscriptions((prev) => prev.map((s) => (s.id === id || s._id === id ? updated : s)));
      toast.success("Subscription cancelled");
    } catch (err) {
      toast.error?.(err.message) ?? setError(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">My Subscriptions</h1>
        <Link
          to={ROUTES.SUBSCRIBE}
          className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
          + New Subscription
        </Link>
      </div>

      {error && (
        <div className="mt-4">
          <Alert type="error" message={error} />
        </div>
      )}

      <div className="mt-6 space-y-4">
        {subscriptions.map((sub) => {
          const id = sub.id || sub._id;
          const planLabel = SUBSCRIPTION_PLANS[sub.plan]?.label || sub.plan;

          return (
            <div key={id} className="rounded-2xl border p-6 dark:border-gray-700">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold">{planLabel}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {MEAL_PREFERENCE_LABELS[sub.mealPreference]}
                  </p>
                </div>
                <SubscriptionStatusBadge status={sub.status} />
              </div>

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Price</p>
                  <p className="font-semibold">{formatPrice(sub.price)}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Start Date</p>
                  <p className="font-semibold">{formatDate(sub.startDate)}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">End Date</p>
                  <p className="font-semibold">{formatDate(sub.endDate)}</p>
                </div>
              </div>

              {sub.status === SUBSCRIPTION_STATUS.ACTIVE && (
                <button
                  type="button"
                  onClick={() => handleCancel(id)}
                  disabled={cancellingId === id}
                  className="mt-4 rounded-xl border border-red-500 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-60 dark:hover:bg-red-500/10"
                >
                  {cancellingId === id ? "Cancelling..." : "Cancel Subscription"}
                </button>
              )}
            </div>
          );
        })}

        {subscriptions.length === 0 && (
          <div className="rounded-2xl border p-10 text-center dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              You don&apos;t have any subscriptions yet.
            </p>
            <Link
              to={ROUTES.SUBSCRIBE}
              className="mt-4 inline-block rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white hover:bg-orange-600"
            >
              Start a Subscription
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubscriptions;