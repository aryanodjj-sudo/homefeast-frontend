import { useMemo, useState } from "react";
import chefs from "../data/chefs";
import useMeals from "../hooks/useMeals";
import ChefProfileCard from "../components/Chef/ChefProfileCard";
import SearchBar from "../components/Common/SearchBar";
import Loader from "../components/Common/Loader";

// Full chef directory. Dish counts are derived from meals.js (meal.chefId)
// rather than stored on the chef record, so this page can never show a
// count that's out of sync with what's actually on the menu.
const Chefs = () => {
  const { meals, loading } = useMeals();
  const [query, setQuery] = useState("");

  const dishCountByChef = useMemo(() => {
    return meals.reduce((counts, meal) => {
      if (!meal.chefId) return counts;
      counts[meal.chefId] = (counts[meal.chefId] || 0) + 1;
      return counts;
    }, {});
  }, [meals]);

  const visibleChefs = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return chefs;

    return chefs.filter((chef) => {
      const haystack = [chef.name, chef.speciality, chef.location, ...chef.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(search);
    });
  }, [query]);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
          👨‍🍳 Meet the Chefs
        </span>

        <h1 className="mt-4 font-display text-4xl font-semibold text-gray-900">
          The home chefs behind HomeFeast
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-gray-500">
          Every dish is cooked by a real home chef in their own kitchen.
          Here's who's actually behind today's menu.
        </p>
      </div>

      <div className="mx-auto mb-10 max-w-xl">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by name, cuisine, or city..."
          ariaLabel="Search chefs"
        />
      </div>

      {visibleChefs.length === 0 ? (
        <div className="rounded-2xl border py-16 text-center text-gray-500 dark:border-gray-700">
          No chefs match "{query}". Try a different name, cuisine, or city.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {visibleChefs.map((chef) => (
            <ChefProfileCard
              key={chef.id}
              chef={chef}
              dishCount={dishCountByChef[chef.id] || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Chefs;