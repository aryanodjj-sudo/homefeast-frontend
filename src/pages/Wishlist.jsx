import { Link } from "react-router-dom";
import useWishlist from "../hooks/useWishlist";
import { isWishlistEmpty } from "../utils/wishlistHelpers";
import MealList from "../components/Meals/MealList";

// Wishlisted meals are stored as full meal objects (see WishlistContext),
// the same shape the catalog uses — so this page reuses MealList/MealCard
// as-is instead of duplicating a near-identical card component.
const Wishlist = () => {
  const { wishlist, clearWishlist } = useWishlist();

  if (isWishlistEmpty(wishlist)) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Your Wishlist is Empty</h1>
        <p className="mt-3 text-gray-500">
          Tap the heart on any meal to save it here for later.
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
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Wishlist</h1>
        <button
          type="button"
          onClick={clearWishlist}
          className="text-sm text-gray-500 hover:text-red-500"
        >
          Clear Wishlist
        </button>
      </div>

      <MealList meals={wishlist} />
    </div>
  );
};

export default Wishlist;