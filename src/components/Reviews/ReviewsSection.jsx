import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useReviews from "../../hooks/useReviews";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import Loader from "../Common/Loader";
import Alert from "../Common/Alert";
import { ROUTES } from "../../utils/constants";

// Self-contained: drop <ReviewsSection mealId={meal.id} /> into any page and
// it handles its own fetching, writing, editing, and deleting.
const ReviewsSection = ({ mealId }) => {
  const { isAuthenticated } = useAuth();
  const {
    reviews,
    loading,
    error,
    averageRating,
    addReview,
    editReview,
    removeReview,
    currentUserId,
  } = useReviews(mealId);

  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const myReview = reviews.find((r) => r.userId === currentUserId);

  const handleAdd = async (values) => {
    setSubmitting(true);
    try {
      await addReview(values);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (values) => {
    setSubmitting(true);
    try {
      await editReview(editingId, values);
      setEditingId(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete your review?")) return;
    await removeReview(id);
  };

  if (loading) return <Loader />;

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        {reviews.length > 0 && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ★ {averageRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
          </span>
        )}
      </div>

      {error && (
        <div className="mt-4">
          <Alert type="error" message={error} />
        </div>
      )}

      <div className="mt-6">
        {!isAuthenticated && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Link to={ROUTES.LOGIN} className="font-medium text-orange-500 hover:underline">
              Log in
            </Link>{" "}
            to write a review.
          </p>
        )}

        {isAuthenticated && !myReview && (
          <ReviewForm onSubmit={handleAdd} submitting={submitting} />
        )}

        {isAuthenticated && myReview && editingId === myReview.id && (
          <ReviewForm
            initialValues={myReview}
            onSubmit={handleEdit}
            onCancel={() => setEditingId(null)}
            submitting={submitting}
          />
        )}
      </div>

      <div className="mt-6 space-y-4">
        {reviews
          .filter((r) => !(editingId === r.id))
          .map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isOwner={review.userId === currentUserId}
              onEdit={() => setEditingId(review.id)}
              onDelete={() => handleDelete(review.id)}
            />
          ))}

        {reviews.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No reviews yet. Be the first to share your experience.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;