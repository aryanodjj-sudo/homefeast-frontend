import useMeals from "../../hooks/useMeals";
import MealList from "./MealList";
import SectionTitle from "../Common/SectionTitle";
import Loader from "../Common/Loader";
import Alert from "../Common/Alert";

// Homepage highlight strip — shows the top-rated meals only.
// The full catalog now lives on the /menu page (Menu.jsx).
const FEATURED_COUNT = 4;

const MealsSection = () => {
  const { meals, loading, error } = useMeals();

  const featuredMeals = [...meals]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, FEATURED_COUNT);

  return (
    <section id="meals" className="scroll-mt-24 container mx-auto px-4 py-20">
      <SectionTitle
        eyebrow="Today's picks"
        title="Our most loved meals"
        subtitle="Freshly prepared homemade meals, cooked by home chefs using ingredients they'd feed their own family."
      />

      {loading && <Loader />}

      {!loading && error && <Alert type="error" message={error} />}

      {!loading && !error && featuredMeals.length === 0 && (
        <p className="text-center text-gray-500">
          No meals available right now. Please check back soon.
        </p>
      )}

      {!loading && !error && featuredMeals.length > 0 && (
        <MealList meals={featuredMeals} />
      )}
    </section>
  );
};

export default MealsSection;