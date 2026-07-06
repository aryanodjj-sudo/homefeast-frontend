// Filters a meal list by category.
// "All" (or no category) is treated as "no filter" — returns the list untouched.
export const filterMeals = (meals = [], category = "All") => {
  if (!category || category === "All") {
    return meals;
  }

  return meals.filter((meal) => meal.category === category);
};

export default filterMeals;