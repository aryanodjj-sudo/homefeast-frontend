import { useState } from "react";
import { validateCoupon } from "../../utils/orderHelpers";

// Self-contained coupon widget: takes the current subtotal (to validate
// minOrder rules) and reports the applied coupon back up via onApply/onRemove.
const CouponInput = ({ subtotal, appliedCoupon, onApply, onRemove }) => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(null);

  const handleApply = () => {
    const result = validateCoupon(code, subtotal);

    if (!result.valid) {
      setMessage({ type: "error", text: result.message });
      return;
    }

    onApply(result.coupon);
    setMessage({ type: "success", text: `"${result.coupon.code}" applied!` });
    setCode("");
  };

  const handleRemove = () => {
    onRemove();
    setMessage(null);
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-green-500 bg-green-50 p-4 dark:bg-green-500/10">
        <div>
          <p className="font-semibold text-green-700 dark:text-green-400">
            {appliedCoupon.code} applied
          </p>
          <p className="text-sm text-green-600 dark:text-green-500">
            Coupon discount applied to your order
          </p>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          className="text-sm font-medium text-red-500 hover:underline"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter coupon code"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={!code.trim()}
          className="shrink-0 rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900"
        >
          Apply
        </button>
      </div>

      {message && (
        <p
          className={`mt-2 text-sm ${
            message.type === "error" ? "text-red-500" : "text-green-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
};

export default CouponInput;