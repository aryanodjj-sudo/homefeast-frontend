import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import { isCartEmpty } from "../utils/cartHelpers";
import CartItem from "../components/Cart/CartItem";
import CartSummary from "../components/Cart/CartSummary";

const Cart = () => {
  const { cart, clearCart } = useCart();

  if (isCartEmpty(cart)) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mt-3 text-gray-500">
          Looks like you haven't added any meals yet.
        </p>
        <Link
          to="/menu"
          className="mt-6 inline-block rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm text-gray-500 hover:text-red-500"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default Cart;