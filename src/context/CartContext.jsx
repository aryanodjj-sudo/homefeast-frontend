import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AuthContext from "./AuthContext";

const CartContext = createContext();

// Safety net: always resolve a stable identifier even if some API response
// is ever missing the `id` field and only has Mongo's `_id`.
const getItemId = (obj) => obj.id ?? obj._id;

// Cart is stored per-account so logging into a different user never shows
// the previous user's items. Logged-out browsing gets its own "guest" bucket.
const getCartKey = (userId) => `homefeast-cart-${userId || "guest"}`;

// Drops any cart entry that doesn't have a usable id. This heals carts that
// were saved by an older, buggy build, which otherwise kept failing order
// placement with "mealId is required".
const sanitize = (items) => items.filter((item) => Boolean(getItemId(item)));

const readCart = (userId) => {
  const saved = localStorage.getItem(getCartKey(userId));
  const parsed = saved ? JSON.parse(saved) : [];
  return sanitize(parsed);
};

export const CartProvider = ({ children }) => {
  const auth = useContext(AuthContext);
  const userId = auth?.user?.id ?? auth?.user?._id ?? null;

  const [cart, setCart] = useState(() => readCart(userId));

  // Whenever the logged-in user changes (login, logout, or switching to a
  // different account), swap to that user's own saved cart instead of
  // carrying over whatever was in the previous session.
  useEffect(() => {
    setCart(readCart(userId));
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(getCartKey(userId), JSON.stringify(cart));
  }, [cart, userId]);

  const addToCart = (meal) => {
    setCart((prev) => {
      const mealId = getItemId(meal);
      const existingMeal = prev.find((item) => getItemId(item) === mealId);

      if (existingMeal) {
        return prev.map((item) =>
          getItemId(item) === mealId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...meal, id: mealId, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => getItemId(item) !== id));
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        getItemId(item) === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          getItemId(item) === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;