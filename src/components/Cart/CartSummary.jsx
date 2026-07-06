import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import useCart from "../../hooks/useCart";

// Order summary sidebar: item count, total, and checkout CTA.
const CartSummary = () => {
  const { totalItems, totalPrice } = useCart();

  return (
    <div className="rounded-2xl border p-6">
      <h2 className="text-xl font-bold">Order Summary</h2>

      <div className="mt-4 flex justify-between text-gray-500">
        <span>Items</span>
        <span>{totalItems}</span>
      </div>

      <div className="mt-2 flex justify-between text-lg font-bold">
        <span>Total</span>
        <span className="text-orange-500">{formatPrice(totalPrice)}</span>
      </div>

      <Link
        to="/checkout"
        className="mt-6 block rounded-xl bg-orange-500 px-4 py-3 text-center font-semibold text-white transition hover:bg-orange-600"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
};

export default CartSummary;