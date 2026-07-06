import { useCallback, useEffect, useState } from "react";
import { reviewsAPI } from "../utils/api";
import useAuth from "./useAuth";

// Scoped to a single meal - Meal Details is the only place reviews are
// read/written from the customer side, so there's no need for a Context here.
const useReviews = (mealId) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadReviews = useCallback(async () => {
    if (!mealId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await reviewsAPI.getReviewsForMeal(mealId);
      setReviews(data);
    } catch (err) {
      setError(err.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [mealId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadReviews();
  }, [loadReviews]);

  const addReview = async ({ rating, comment }) => {
    if (!user) throw new Error("You must be logged in to write a review");

    const newReview = await reviewsAPI.createReview({
      mealId,
      userId: user.id,
      author: user.name,
      rating,
      comment,
    });

    setReviews((prev) => [newReview, ...prev]);
    return newReview;
  };

  const editReview = async (id, { rating, comment }) => {
    const updated = await reviewsAPI.updateOwnReview(id, user.id, { rating, comment });
    setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  };

  const removeReview = async (id) => {
    await reviewsAPI.deleteOwnReview(id, user.id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return {
    reviews,
    loading,
    error,
    averageRating,
    addReview,
    editReview,
    removeReview,
    currentUserId: user?.id,
  };
};

export default useReviews;