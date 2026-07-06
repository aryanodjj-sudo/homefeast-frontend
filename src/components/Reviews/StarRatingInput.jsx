import { useState } from "react";

// Clickable 1-5 star picker. Hover previews the rating before it's committed.
const StarRatingInput = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          className="text-2xl leading-none transition-transform hover:scale-110"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <span className={(hovered || value) >= star ? "text-yellow-500" : "text-gray-300 dark:text-gray-700"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
};

export default StarRatingInput;