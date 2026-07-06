import { formatPrice } from "../../utils/formatPrice";
import { CHECKOUT_CONFIG } from "../../utils/constants";

// Read-only order-total summary shown on the Checkout sidebar.
// Takes the already-computed `pricing` object from utils/orderHelpers.js
// (getOrderPricing) so the numbers here can never drift from what's
// actually charged - this component only formats and displays them.
const PriceBreakdown = ({ pricing, couponCode, actionSlot }) => {
  const { subtotal, shipping, tax, discount, total } = pricing;

  const qualifiesForFreeShipping = shipping === 0 && subtotal > 0;
  const amountToFreeShipping = Math.max(
    CHECKOUT_CONFIG.FREE_SHIPPING_THRESHOLD - subtotal,
    0
  );

  return (
    <div className="rounded-2xl border p-6 dark:border-gray-700">
      <h2 className="text-xl font-bold">Price Details</h2>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Delivery Fee</span>
          {shipping === 0 ? (
            <span className="font-medium text-green-600 dark:text-green-400">FREE</span>
          ) : (
            <span className="font-medium">{formatPrice(shipping)}</span>
          )}
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Tax (GST)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">
              Discount{couponCode ? ` (${couponCode})` : ""}
            </span>
            <span className="font-medium text-green-600 dark:text-green-400">
              −{formatPrice(discount)}
            </span>
          </div>
        )}

        {!qualifiesForFreeShipping && amountToFreeShipping > 0 && (
          <p className="rounded-lg bg-orange-50 px-3 py-2 text-xs text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
            Add {formatPrice(amountToFreeShipping)} more to get free delivery
          </p>
        )}
      </div>

      <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold dark:border-gray-700">
        <span>Total</span>
        <span className="text-orange-500">{formatPrice(total)}</span>
      </div>

      {actionSlot}
    </div>
  );
};

export default PriceBreakdown;