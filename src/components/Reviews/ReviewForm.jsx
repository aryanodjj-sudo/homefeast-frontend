import { useState } from "react";
import StarRatingInput from "./StarRatingInput";

// Handles both "write a new review" and "edit my review" - `initialValues`
// present means edit mode, same as MealForm's meal-present convention.
const ReviewForm = ({ initialValues, onSubmit, onCancel, submitting }) => {
  const [rating, setRating] = useState(initialValues?.rating || 0);
  const [comment, setComment] = useState(initialValues?.comment || "");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Please select a star rating");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a short comment");
      return;
    }

    try {
      await onSubmit({ rating, comment });
      if (!initialValues) {
        setRating(0);
        setComment("");
      }
    } catch (err) {
      setError(err.message || "Could not submit review");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border p-5 dark:border-gray-700">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Your rating</p>
      <div className="mt-2">
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Share your experience with this dish..."
        className="mt-4 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
      />

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <div className="mt-4 flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border px-4 py-2 font-medium dark:border-gray-700"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : initialValues ? "Save Changes" : "Submit Review"}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;