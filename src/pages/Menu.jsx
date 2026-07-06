import { useMemo, useState } from "react";
import useMeals from "../hooks/useMeals";
import MealList from "../components/Meals/MealList";
import MealFilter from "../components/Meals/MealFilter";
import MealSort from "../components/Meals/MealSort";
import SearchBar from "../components/Common/SearchBar";
import Loader from "../components/Common/Loader";
import { searchMeals } from "../utils/searchMeals";
import { filterMeals } from "../utils/filterMeals";
import { sortMeals } from "../utils/sortMeals";

// Full menu page — search, category filter, and sort all pipeline together:
// search narrows by text -> filter narrows by category -> sort reorders the result.
const Menu = () => {
  const { meals, loading } = useMeals();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const categories = useMemo(
    () => ["All", ...new Set(meals.map((meal) => meal.category))],
    [meals]
  );

  const hasMeals = meals.length > 0;

  const visibleMeals = useMemo(() => {
    const searched = searchMeals(meals, query);
    const filtered = filterMeals(searched, category);
    return sortMeals(filtered, sort);
  }, [meals, query, category, sort]);

  const hasResults = visibleMeals.length > 0;

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
          🍽️ Full Menu
        </span>

        <h1 className="mt-4 text-4xl font-extrabold text-gray-900">
          Explore Our Meals
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-gray-500">
          Handpicked, freshly prepared dishes from HomeFeast's home chefs —
          browse the full menu below.
        </p>
      </div>

      {hasMeals && (
        <div className="mb-10 flex flex-col items-center gap-4 md:flex-row md:justify-center">
          <div className="w-full max-w-xl">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search by dish, category, or ingredient..."
            />
          </div>

          <div className="flex gap-3">
            <MealFilter
              category={category}
              setCategory={setCategory}
              categories={categories}
            />
            <MealSort sort={sort} setSort={setSort} />
          </div>
        </div>
      )}

      {!hasMeals && (
        <div className="rounded-2xl border py-16 text-center text-gray-500">
          No meals are available right now. Please check back soon.
        </div>
      )}

      {hasMeals && !hasResults && (
        <div className="rounded-2xl border py-16 text-center text-gray-500">
          No meals match your search and filters. Try adjusting them.
        </div>
      )}

      {hasMeals && hasResults && <MealList meals={visibleMeals} />}
    </div>
  );
};

export default Menu;