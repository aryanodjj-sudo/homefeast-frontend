import Price from "../Common/Price";
import Rating from "../Common/Rating";
import useCart from "../../hooks/useCart";
import useWishlist from "../../hooks/useWishlist";
import useToast from "../../hooks/useToast";

const MealCard = ({ meal }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast();

  const wishlisted = isWishlisted(meal.id);

  const handleAddToCart = () => {
    addToCart(meal);
    toast.success(`${meal.name} added to cart`);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(meal);
    toast[wishlisted ? "info" : "success"](
      wishlisted ? `Removed ${meal.name} from wishlist` : `${meal.name} added to wishlist`
    );
  };

  return (
    <div
      className="
        group
        overflow-hidden
        rounded-3xl
        border
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-2xl
      "
    >
      <div className="overflow-hidden">
        <img
          src={meal.image}
          alt={meal.name}
          className="
            h-56
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-110
          "
        />
      </div>

      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xl font-bold">
            {meal.name}
          </h3>

          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
            {meal.rating >= 4.7 ? "Popular" : meal.category}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-gray-500">
          {meal.description}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <Price value={meal.price} />
          <Rating value={meal.rating} />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleAddToCart}
            className="
              flex-1
              rounded-xl
              bg-orange-500
              px-4
              py-3
              font-semibold
              text-white
              transition
              hover:bg-orange-600
            "
          >
            🛒 Add to Cart
          </button>

          <button
            onClick={handleToggleWishlist}
            className={`
              rounded-xl
              border
              px-4
              py-3
              transition
              hover:bg-red-50
              ${wishlisted ? "border-red-300 bg-red-50" : ""}
            `}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {wishlisted ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealCard;