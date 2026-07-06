import { Link } from "react-router-dom";
import Rating from "../Common/Rating";
import { ROUTES } from "../../utils/constants";

// Full profile card for the /chefs directory - richer than the compact
// ChefCard used in the homepage teaser. dishCount is passed in rather than
// looked up here, so this component stays a pure display piece and the
// meals ↔ chef cross-reference lives in one place (Chefs.jsx).
const ChefProfileCard = ({ chef, dishCount }) => {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start gap-4">
        <img
          src={chef.image}
          alt={chef.name}
          className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-turmeric/20"
        />

        <div className="min-w-0">
          <h3 className="font-display text-xl font-semibold">{chef.name}</h3>
          <p className="text-sm font-medium text-curry">{chef.speciality}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            📍 {chef.location} · {chef.experienceYears}+ yrs experience
          </p>
        </div>
      </div>

      <p className="mt-4 flex-1 text-sm text-gray-600 dark:text-gray-300">
        {chef.bio}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {chef.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-rice px-3 py-1 text-xs font-medium text-ink dark:bg-gray-800 dark:text-gray-200"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4 dark:border-gray-700">
        <Rating value={chef.rating} />
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {dishCount} dish{dishCount === 1 ? "" : "es"} on the menu
        </span>
      </div>

      <Link
        to={ROUTES.MENU}
        className="mt-5 block rounded-xl border border-orange-500 px-4 py-2.5 text-center font-semibold text-orange-500 transition hover:bg-orange-500 hover:text-white"
      >
        See what they cook
      </Link>
    </div>
  );
};

export default ChefProfileCard;