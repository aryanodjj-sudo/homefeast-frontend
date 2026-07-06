import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import useOrders from "../hooks/useOrders";
import AddressForm from "../components/Checkout/AddressForm";
import PaymentMethodSelector from "../components/Checkout/PaymentMethodSelector";
import CouponInput from "../components/Checkout/CouponInput";
import PriceBreakdown from "../components/Checkout/PriceBreakdown";
import Alert from "../components/Common/Alert";
import { getOrderPricing } from "../utils/orderHelpers";
import { validateAddressForm, hasErrors } from "../utils/validators";
import { PAYMENT_METHODS, ROUTES } from "../utils/constants";
import { formatPrice } from "../utils/formatPrice";

const EMPTY_ADDRESS = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [address, setAddress] = useState({ ...EMPTY_ADDRESS, fullName: user?.name || "" });
  const [addressErrors, setAddressErrors] = useState({});

  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.COD);
  const [cardDetails, setCardDetails] = useState({ cardNumber: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [paymentErrors, setPaymentErrors] = useState({});

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState(null);

  const pricing = getOrderPricing(cart, appliedCoupon);

  if (cart.length === 0) {
    return <Navigate to={ROUTES.CART} replace />;
  }

  const validatePayment = () => {
    const errors = {};

    if (paymentMethod === PAYMENT_METHODS.CARD) {
      const digits = cardDetails.cardNumber.replace(/\s/g, "");
      if (!/^\d{16}$/.test(digits)) errors.cardNumber = "Enter a valid 16-digit card number";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) errors.expiry = "Use MM/YY format";
      if (!/^\d{3,4}$/.test(cardDetails.cvv)) errors.cvv = "Enter a valid CVV";
    }

    if (paymentMethod === PAYMENT_METHODS.UPI) {
      if (!/^[\w.-]+@[\w]+$/.test(upiId)) errors.upiId = "Enter a valid UPI ID";
    }

    return errors;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlaceError(null);

    const addrErrors = validateAddressForm(address);
    const payErrors = validatePayment();

    setAddressErrors(addrErrors);
    setPaymentErrors(payErrors);

    if (hasErrors(addrErrors) || hasErrors(payErrors)) {
      return;
    }

    setPlacing(true);

    try {
      const orderItems = cart
        .filter((item) => Boolean(item.id))
        .map((item) => ({
          mealId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }));

      if (orderItems.length === 0) {
        setPlaceError(
          "Some items in your cart are outdated. Please remove them from the cart and add them again."
        );
        setPlacing(false);
        return;
      }

      const order = await placeOrder({
        items: orderItems,
        address,
        paymentMethod,
        pricing,
        coupon: appliedCoupon,
      });

      clearCart();
      navigate(ROUTES.orderSuccess(order.id));
    } catch (err) {
      setPlaceError(err.message || "Could not place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Checkout</h1>

      {placeError && (
        <div className="mt-4">
          <Alert type="error" message={placeError} />
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AddressForm address={address} errors={addressErrors} onChange={setAddress} />

          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
            cardDetails={cardDetails}
            onCardChange={(e) => setCardDetails({ ...cardDetails, [e.target.name]: e.target.value })}
            upiId={upiId}
            onUpiChange={(e) => setUpiId(e.target.value)}
            errors={paymentErrors}
          />

          <div className="rounded-2xl border p-6 dark:border-gray-700">
            <h2 className="text-xl font-bold">Have a coupon?</h2>
            <div className="mt-4">
              <CouponInput
                subtotal={pricing.subtotal}
                appliedCoupon={appliedCoupon}
                onApply={setAppliedCoupon}
                onRemove={() => setAppliedCoupon(null)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border p-6 dark:border-gray-700">
            <h2 className="text-xl font-bold">Items ({cart.length})</h2>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <PriceBreakdown
            pricing={pricing}
            couponCode={appliedCoupon?.code}
            actionSlot={
              <button
                type="submit"
                disabled={placing}
                className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 text-center font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {placing ? "Placing Order..." : `Place Order · ${formatPrice(pricing.total)}`}
              </button>
            }
          />
        </div>
      </form>
    </div>
  );
};

export default Checkout;