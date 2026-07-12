import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useMeals from "../hooks/useMeals";
import chefs from "../data/chefs";
import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";
import Price from "../components/Common/Price";
import Rating from "../components/Common/Rating";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import ReviewsSection from "../components/Reviews/ReviewsSection";
import useToast from "../hooks/useToast";

const MealDetails = () => {
  const { id } = useParams();
  const { meals, loading } = useMeals();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast();

  const meal = meals.find((item) => String(item.id) === String(id));
  const chef = meal?.chefId
    ? chefs.find((item) => item.id === meal.chefId)
    : null;

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (loading) return <Loader />;

  if (!meal) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Meal Not Found</h1>
        <p className="mt-3 text-gray-500">
          The meal you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          to="/menu"
          className="mt-6 inline-block rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Back to Menu
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(meal.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i += 1) {
      addToCart(meal);
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
    toast.success(
      quantity > 1 ? `${quantity} × ${meal.name} added to cart` : `${meal.name} added to cart`
    );
  };

  const handleToggleWishlist = () => {
    toggleWishlist(meal);
    toast[wishlisted ? "info" : "success"](
      wishlisted ? `Removed ${meal.name} from wishlist` : `${meal.name} added to wishlist`
    );
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <Link to="/menu" className="text-sm text-gray-500 hover:text-orange-500">
        ← Back to Menu
      </Link>

      <div className="mt-4 grid gap-10 md:grid-cols-2">
        <img
          src={meal.image}
          alt={meal.name}
          className="h-80 w-full rounded-2xl object-cover md:h-full"
        />

        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
              {meal.category}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                meal.isVeg
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {meal.isVeg ? "Veg" : "Non-Veg"}
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-bold">{meal.name}</h1>

          <div className="mt-3">
            <Rating value={meal.rating} />
          </div>

          {chef && (
            <p className="mt-3 text-sm text-gray-500">
              Prepared by <span className="font-semibold text-gray-700">{chef.name}</span>
              {" "}&middot; {chef.speciality}
            </p>
          )}

          <p className="mt-5 text-gray-500">{meal.description}</p>

          <div className="mt-6">
            <Price value={meal.price} originalValue={meal.originalPrice} />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-xl border">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-4 py-3 text-lg font-semibold hover:text-orange-500"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="min-w-[2rem] text-center font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-4 py-3 text-lg font-semibold hover:text-orange-500"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <Button onClick={handleAddToCart} className="flex-1 sm:flex-none">
              {justAdded ? "Added ✓" : "🛒 Add to Cart"}
            </Button>

            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`rounded-xl border px-4 py-3 transition hover:bg-red-50 ${
                wishlisted ? "border-red-300 bg-red-50" : ""
              }`}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              {wishlisted ? "❤️" : "🤍"}
            </button>
          </div>
        </div>
      </div>

      <ReviewsSection mealId={meal.id} />
    </div>
  );
};

export default MealDetails;