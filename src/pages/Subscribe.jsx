import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import { subscriptionAPI } from "../utils/api";
import { validateAddressForm, hasErrors } from "../utils/validators";
import { formatPrice } from "../utils/formatPrice";
import {
  SUBSCRIPTION_PLANS,
  MEAL_PREFERENCES,
  MEAL_PREFERENCE_LABELS,
  PAYMENT_METHODS,
  ROUTES,
} from "../utils/constants";
import AddressForm from "../components/Checkout/AddressForm";
import PaymentMethodSelector from "../components/Checkout/PaymentMethodSelector";
import Alert from "../components/Common/Alert";

const EMPTY_ADDRESS = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

const Subscribe = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [mealPreference, setMealPreference] = useState(MEAL_PREFERENCES.VEG);
  const [address, setAddress] = useState({ ...EMPTY_ADDRESS, fullName: user?.name || "" });
  const [addressErrors, setAddressErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.COD);
  const [cardDetails, setCardDetails] = useState({ cardNumber: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const plan = SUBSCRIPTION_PLANS[selectedPlan];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const errors = validateAddressForm(address);
    setAddressErrors(errors);
    if (hasErrors(errors)) return;

    try {
      setSubmitting(true);
      await subscriptionAPI.subscribe({
        userId: user.id,
        plan: selectedPlan,
        mealPreference,
        address,
        paymentMethod,
      });
      toast.success("Subscription activated! Your first meal is on its way. 🎉");
      navigate(ROUTES.MY_SUBSCRIPTIONS);
    } catch (error) {
      setFormError(error.message || "Could not activate subscription. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Meal Subscription</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Get a home-cooked meal delivered to your door every day, for as long as your plan is
        active — no daily ordering needed.
      </p>

      {formError && (
        <div className="mt-6">
          <Alert type="error" message={formError} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Plan selection */}
        <div className="rounded-2xl border p-6 dark:border-gray-700">
          <h2 className="text-xl font-bold">Choose a Plan</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {Object.values(SUBSCRIPTION_PLANS).map((p) => (
              <label
                key={p.id}
                className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-colors ${
                  selectedPlan === p.id
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={p.id}
                  checked={selectedPlan === p.id}
                  onChange={() => setSelectedPlan(p.id)}
                  className="sr-only"
                />
                {p.badge && (
                  <span className="absolute -top-3 right-4 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                    {p.badge}
                  </span>
                )}
                <p className="font-semibold">{p.label}</p>
                <p className="mt-1 text-2xl font-extrabold text-orange-500">
                  {formatPrice(p.price)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{p.tagline}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Meal preference */}
        <div className="rounded-2xl border p-6 dark:border-gray-700">
          <h2 className="text-xl font-bold">Meal Preference</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {Object.values(MEAL_PREFERENCES).map((pref) => (
              <label
                key={pref}
                className={`cursor-pointer rounded-xl border p-4 text-center font-medium transition-colors ${
                  mealPreference === pref
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="mealPreference"
                  value={pref}
                  checked={mealPreference === pref}
                  onChange={() => setMealPreference(pref)}
                  className="sr-only"
                />
                {MEAL_PREFERENCE_LABELS[pref]}
              </label>
            ))}
          </div>
        </div>

        <AddressForm address={address} errors={addressErrors} onChange={setAddress} />

        <PaymentMethodSelector
          paymentMethod={paymentMethod}
          onMethodChange={setPaymentMethod}
          cardDetails={cardDetails}
          onCardChange={(e) => setCardDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
          upiId={upiId}
          onUpiChange={(e) => setUpiId(e.target.value)}
          errors={{}}
        />

        <div className="rounded-2xl border p-6 dark:border-gray-700">
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total ({plan.label})</span>
            <span className="text-orange-500">{formatPrice(plan.price)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Activating..." : `Subscribe — ${formatPrice(plan.price)}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Subscribe;