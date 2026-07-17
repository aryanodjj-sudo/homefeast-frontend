import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../Common/Button";
import useMeals from "../../hooks/useMeals";
import { formatPrice } from "../../utils/formatPrice";
import { ROUTES } from "../../utils/constants";

const STATS = [
  { value: "500+", label: "Happy customers" },
  { value: "10+", label: "Home chefs" },
  { value: "1000+", label: "Meals delivered" },
];

const TICKER_COUNT = 3;

const HeroContent = () => {
  const navigate = useNavigate();
  const { meals, loading } = useMeals();

  // Real dishes, not invented copy - top-rated meals currently on the menu,
  // so this ticker never drifts out of sync with what's actually orderable.
  const todaysPicks = useMemo(
    () => [...meals].sort((a, b) => b.rating - a.rating).slice(0, TICKER_COUNT),
    [meals]
  );

  return (
    <div className="max-w-xl">
      <span
        className="animate-rise inline-flex items-center gap-2 rounded-full border border-rice/20 bg-rice/5 px-4 py-2 text-xs font-semibold tracking-wide text-turmeric uppercase"
        style={{ animationDelay: "0ms" }}
      >
        Not a cloud kitchen. An actual home kitchen.
      </span>

      <h1
        className="animate-rise mt-6 font-display text-5xl font-semibold leading-[1.05] text-rice md:text-6xl"
        style={{ animationDelay: "80ms" }}
      >
        Home-cooked meals,
        <br />
        from an actual home.
      </h1>

      <p
        className="animate-rise mt-6 text-lg leading-8 text-rice/70"
        style={{ animationDelay: "160ms" }}
      >
        Every dish on HomeFeast is cooked by a home chef in their own
        kitchen — real recipes, fresh ingredients, on your table within
        the hour.
      </p>

      <div
        className="animate-rise mt-8 flex flex-wrap gap-4"
        style={{ animationDelay: "240ms" }}
      >
        <Button onClick={() => navigate(ROUTES.MENU)} className="!px-7 !py-3.5">
          Order Now
        </Button>

        <Link
          to={ROUTES.MENU}
          className="rounded-xl border border-rice/25 px-7 py-3.5 font-semibold text-rice transition hover:bg-rice/10"
        >
          Browse today's menu
        </Link>
      </div>

      {!loading && todaysPicks.length > 0 && (
        <div
          className="animate-rise mt-10"
          style={{ animationDelay: "320ms" }}
        >
          <p className="text-xs font-semibold tracking-wide text-rice/50 uppercase">
            Cooking right now
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {todaysPicks.map((meal) => (
              <span
                key={meal.id}
                className="rounded-full border border-rice/15 bg-rice/5 px-4 py-2 text-sm text-rice/80"
              >
                {meal.name}{" "}
                <span className="text-turmeric">{formatPrice(meal.price)}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        className="animate-rise mt-10 flex gap-8 border-t border-rice/10 pt-8"
        style={{ animationDelay: "360ms" }}
      >
        {STATS.map((stat) => (
          <div key={stat.label}>
            <h3 className="font-display text-2xl font-semibold text-rice">
              {stat.value}
            </h3>
            <p className="text-sm text-rice/50">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroContent;