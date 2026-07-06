import { formatPrice } from "../../utils/formatPrice";
import { getItemSubtotal } from "../../utils/cartHelpers";
import useCart from "../../hooks/useCart";

// A single line item in the cart: image, name, quantity stepper, subtotal, remove.
const CartItem = ({ item }) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4 rounded-2xl border p-4">
      <img
        src={item.image}
        alt={item.name}
        className="h-20 w-20 rounded-xl object-cover"
      />

      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
      </div>

      <div className="flex items-center rounded-xl border">
        <button
          type="button"
          onClick={() => decreaseQuantity(item.id)}
          className="px-3 py-2 font-semibold hover:text-orange-500"
          aria-label={`Decrease quantity of ${item.name}`}
        >
          −
        </button>
        <span className="min-w-[1.5rem] text-center font-semibold">
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() => increaseQuantity(item.id)}
          className="px-3 py-2 font-semibold hover:text-orange-500"
          aria-label={`Increase quantity of ${item.name}`}
        >
          +
        </button>
      </div>

      <p className="w-20 text-right font-semibold text-orange-500">
        {formatPrice(getItemSubtotal(item))}
      </p>

      <button
        type="button"
        onClick={() => removeFromCart(item.id)}
        className="text-gray-400 hover:text-red-500"
        aria-label={`Remove ${item.name} from cart`}
      >
        ✕
      </button>
    </div>
  );
};

export default CartItem;