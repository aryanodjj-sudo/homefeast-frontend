import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AuthContext from "./AuthContext";

const WishlistContext = createContext();

const getItemId = (obj) => obj.id ?? obj._id;

// Wishlist is stored per-account too, same reasoning as the cart.
const getWishlistKey = (userId) => `homefeast-wishlist-${userId || "guest"}`;

const sanitize = (items) => items.filter((item) => Boolean(getItemId(item)));

const readWishlist = (userId) => {
  const saved = localStorage.getItem(getWishlistKey(userId));
  const parsed = saved ? JSON.parse(saved) : [];
  return sanitize(parsed);
};

export const WishlistProvider = ({ children }) => {
  const auth = useContext(AuthContext);
  const userId = auth?.user?.id ?? auth?.user?._id ?? null;

  const [wishlist, setWishlist] = useState(() => readWishlist(userId));

  useEffect(() => {
    setWishlist(readWishlist(userId));
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(getWishlistKey(userId), JSON.stringify(wishlist));
  }, [wishlist, userId]);

  const toggleWishlist = (meal) => {
    setWishlist((prev) => {
      const mealId = getItemId(meal);
      const exists = prev.some((item) => getItemId(item) === mealId);

      if (exists) {
        return prev.filter((item) => getItemId(item) !== mealId);
      }

      return [...prev, { ...meal, id: mealId }];
    });
  };

  const isWishlisted = (id) => {
    return wishlist.some((item) => getItemId(item) === id);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const totalWishlistItems = useMemo(() => {
    return wishlist.length;
  }, [wishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isWishlisted,
        clearWishlist,
        totalWishlistItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;