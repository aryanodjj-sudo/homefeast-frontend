import { formatDate } from "../../utils/formatDate";

const StarRow = ({ value }) => (
  <span className="text-sm text-yellow-500">
    {"★".repeat(value)}
    <span className="text-gray-300 dark:text-gray-700">{"★".repeat(5 - value)}</span>
  </span>
);

// isOwner controls whether Edit/Delete show up - only the review's author
// (matched by userId in useReviews) sees them.
const ReviewCard = ({ review, isOwner, onEdit, onDelete }) => (
  <div className="rounded-2xl border p-5 dark:border-gray-700">
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="font-semibold">{review.author}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(review.createdAt)}</p>
      </div>
      <StarRow value={review.rating} />
    </div>

    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>

    {isOwner && (
      <div className="mt-3 flex gap-4 text-sm">
        <button type="button" onClick={onEdit} className="font-medium text-orange-500 hover:underline">
          Edit
        </button>
        <button type="button" onClick={onDelete} className="font-medium text-red-500 hover:underline">
          Delete
        </button>
      </div>
    )}
  </div>
);

export default ReviewCard;