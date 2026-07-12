import SectionTitle from "../Common/SectionTitle";
import topReviews from "../../data/topReviews";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const AVATAR_COLORS = [
  "bg-orange-100 text-orange-600",
  "bg-green-100 text-green-700",
  "bg-blue-100 text-blue-700",
  "bg-pink-100 text-pink-700",
  "bg-purple-100 text-purple-700",
];

const getAvatarColor = (name = "") => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const StarRow = ({ rating }) => (
  <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>
        ★
      </span>
    ))}
  </div>
);

const TopReviews = () => {
  return (
    <section id="reviews" className="scroll-mt-24 container mx-auto px-4 py-20">
      <SectionTitle
        eyebrow="Loved by our customers"
        title="What people are saying"
        subtitle="Real feedback from customers who've ordered home-cooked meals through HomeFeast."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topReviews.map((review) => (
          <div
            key={review.id}
            className="flex flex-col rounded-2xl border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
          >
            <StarRow rating={review.rating} />

            <p className="mt-4 flex-1 text-gray-600 dark:text-gray-300">
              &ldquo;{review.text}&rdquo;
            </p>

            <div className="mt-6 flex items-center gap-3 border-t pt-4 dark:border-gray-800">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${getAvatarColor(
                  review.name
                )}`}
              >
                {getInitials(review.name)}
              </span>
              <div>
                <p className="font-semibold">{review.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ordered {review.meal}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopReviews;