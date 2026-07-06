// Filters a meal list by a free-text search query.
// Matches against name, category, and description (case-insensitive) so
// searching "spicy" or "south indian" works just as well as a dish name.
export const searchMeals = (meals = [], query = "") => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return meals;
  }

  return meals.filter((meal) => {
    const haystack = `${meal.name} ${meal.category} ${meal.description}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
};

export default searchMeals;