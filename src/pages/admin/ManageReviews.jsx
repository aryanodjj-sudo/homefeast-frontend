import { useEffect, useState } from "react";
import { reviewsAPI, mealsAPI } from "../../utils/api";
import { formatDate } from "../../utils/formatDate";
import { REVIEW_STATUS } from "../../utils/constants";
import Loader from "../../components/Common/Loader";
import Alert from "../../components/Common/Alert";

// A plain star row for a single review's rating - the shared Rating
// component is built for meal cards (rating + a review-count badge), which
// doesn't read naturally next to one individual review here.
const StarRow = ({ value }) => (
  <div className="text-sm text-yellow-500">
    {"★".repeat(value)}
    <span className="text-gray-300 dark:text-gray-700">{"★".repeat(5 - value)}</span>
  </div>
);

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [mealNames, setMealNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const [reviewData, meals] = await Promise.all([
        reviewsAPI.getReviews(),
        mealsAPI.getMeals(),
      ]);
      setReviews(reviewData);
      setMealNames(Object.fromEntries(meals.map((m) => [m.id, m.name])));
    } catch (err) {
      setError(err.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadReviews();
  }, []);

  const toggleStatus = async (review) => {
    setBusyId(review.id);
    try {
      const nextStatus =
        review.status === REVIEW_STATUS.PUBLISHED
          ? REVIEW_STATUS.HIDDEN
          : REVIEW_STATUS.PUBLISHED;
      const updated = await reviewsAPI.setReviewStatus(review.id, nextStatus);
      setReviews((prev) => prev.map((r) => (r.id === review.id ? updated : r)));
    } catch (err) {
      setError(err.message || "Could not update review");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    setBusyId(id);
    try {
      await reviewsAPI.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message || "Could not delete review");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Reviews</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {reviews.length} review{reviews.length !== 1 ? "s" : ""}. Hidden reviews stay saved but
        won't show on the storefront once reviews go live there (Phase 7).
      </p>

      {error && (
        <div className="mt-4">
          <Alert type="error" message={error} />
        </div>
      )}

      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-2xl border bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{review.author}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {mealNames[review.mealId] || "Unknown meal"} · {formatDate(review.createdAt)}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  review.status === REVIEW_STATUS.PUBLISHED
                    ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {review.status}
              </span>
            </div>

            <div className="mt-2">
              <StarRow value={review.rating} />
            </div>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>

            <div className="mt-4 flex gap-4 text-sm">
              <button
                type="button"
                onClick={() => toggleStatus(review)}
                disabled={busyId === review.id}
                className="font-medium text-orange-500 hover:underline disabled:opacity-60"
              >
                {review.status === REVIEW_STATUS.PUBLISHED ? "Hide" : "Publish"}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(review.id)}
                disabled={busyId === review.id}
                className="font-medium text-red-500 hover:underline disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ManageReviews;