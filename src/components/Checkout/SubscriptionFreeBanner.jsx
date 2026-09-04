import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { subscriptionAPI } from "../../utils/api";
import { SUBSCRIPTION_STATUS } from "../../utils/constants";

// Self-contained: checks the logged-in customer's own subscriptions and
// shows a banner if one is currently active. Drop this anywhere on the
// Checkout page - it doesn't need any props or access to the cart/pricing
// state, so it can't accidentally break anything else on that page.
const SubscriptionFreeBanner = () => {
  const { user } = useAuth();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  useEffect(() => {
    if (!user) return;

    subscriptionAPI
      .getMySubscriptions(user.id)
      .then((subs) => {
        const now = new Date();
        const active = subs.some(
          (s) => s.status === SUBSCRIPTION_STATUS.ACTIVE && new Date(s.endDate) >= now
        );
        setHasActiveSubscription(active);
      })
      .catch(() => setHasActiveSubscription(false));
  }, [user]);

  if (!hasActiveSubscription) return null;

  return (
    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-300 bg-green-50 p-4 dark:border-green-800 dark:bg-green-500/10">
      <span className="text-2xl">🎉</span>
      <div>
        <p className="font-semibold text-green-700 dark:text-green-400">
          You have an active subscription!
        </p>
        <p className="text-sm text-green-600 dark:text-green-500">
          This order is completely FREE — no charge will be made.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionFreeBanner;