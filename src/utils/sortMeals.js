// Sorts a meal list without mutating the original array.
// "default" leaves the catalog order untouched (no sort applied).
export const sortMeals = (meals = [], sortKey = "default") => {
  const sorted = [...meals];

  switch (sortKey) {
    case "low":
      return sorted.sort((a, b) => a.price - b.price);
    case "high":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
};

export default sortMeals;