import { useCallback, useEffect, useState } from "react";
import { mealsAPI } from "../utils/api";

// Not a Context - meals don't need to be globally shared/mutated from many
// components at once the way cart/wishlist/orders do. Each screen that needs
// the catalog (Menu, Home, Meal Details, Admin > Manage Meals) just calls
// this hook and gets its own fetch + refresh, all reading the same
// underlying store in storageManager.js.
const useMeals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMeals = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await mealsAPI.getMeals();
      setMeals(data);
    } catch (err) {
      setError(err.message || "Failed to load meals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMeals();
  }, [loadMeals]);

  return { meals, loading, error, refreshMeals: loadMeals };
};

export default useMeals;