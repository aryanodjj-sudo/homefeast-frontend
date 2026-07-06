import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from "../../utils/constants";
import Input from "../Common/Input";

// Payment is intentionally a UI-only simulation (no real gateway wired up) -
// there's no PCI-compliant way to accept real card data without a licensed
// processor (Razorpay/Stripe etc.), which is outside this project's scope.
// Card/UPI fields are format-validated client-side purely so the flow feels
// real for a demo; nothing is transmitted or stored beyond this session.
const PaymentMethodSelector = ({
  paymentMethod,
  onMethodChange,
  cardDetails,
  onCardChange,
  upiId,
  onUpiChange,
  errors,
}) => {
  const methods = [PAYMENT_METHODS.COD, PAYMENT_METHODS.CARD, PAYMENT_METHODS.UPI];

  return (
    <div className="rounded-2xl border p-6 dark:border-gray-700">
      <h2 className="text-xl font-bold">Payment Method</h2>

      <div className="mt-4 space-y-3">
        {methods.map((method) => (
          <label
            key={method}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
              paymentMethod === method
                ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={paymentMethod === method}
              onChange={() => onMethodChange(method)}
              className="h-4 w-4 accent-orange-500"
            />
            <span className="font-medium">{PAYMENT_METHOD_LABELS[method]}</span>
          </label>
        ))}
      </div>

      {paymentMethod === PAYMENT_METHODS.CARD && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Card Number"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.cardNumber}
              onChange={onCardChange}
              error={errors.cardNumber}
              required
            />
          </div>
          <Input
            label="Expiry (MM/YY)"
            name="expiry"
            placeholder="MM/YY"
            value={cardDetails.expiry}
            onChange={onCardChange}
            error={errors.expiry}
            required
          />
          <Input
            label="CVV"
            name="cvv"
            type="password"
            placeholder="123"
            value={cardDetails.cvv}
            onChange={onCardChange}
            error={errors.cvv}
            required
          />
        </div>
      )}

      {paymentMethod === PAYMENT_METHODS.UPI && (
        <div className="mt-4">
          <Input
            label="UPI ID"
            name="upiId"
            placeholder="yourname@upi"
            value={upiId}
            onChange={onUpiChange}
            error={errors.upiId}
            required
          />
        </div>
      )}

      {paymentMethod === PAYMENT_METHODS.COD && (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Pay with cash when your order arrives.
        </p>
      )}
    </div>
  );
};

export default PaymentMethodSelector;