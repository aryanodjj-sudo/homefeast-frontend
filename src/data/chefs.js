// Home chef directory for HomeFeast.
// id links back from meals.js (meal.chefId) so Meal Details and the Chefs
// page both read from this single source — a chef's dish count here is
// always derived from meals.js, never hardcoded, so the two can't drift apart.
const chefs = [
  {
    id: 1,
    name: "Chef Rahul",
    speciality: "Indian Cuisine",
    rating: 4.9,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    location: "Bengaluru",
    experienceYears: 8,
    tags: ["North Indian", "Comfort Food", "Non-Veg Friendly"],
    bio: "Grew up cooking in his family's kitchen in Lucknow before bringing those recipes to HomeFeast — known for rich, slow-cooked gravies made the old-fashioned way.",
  },
  {
    id: 2,
    name: "Chef Priya",
    speciality: "Healthy Food",
    rating: 4.8,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    location: "Pune",
    experienceYears: 6,
    tags: ["South Indian", "Vegetarian", "Light & Healthy"],
    bio: "A former nutritionist who traded spreadsheets for the stove — she cooks South Indian staples the way her grandmother did, without cutting corners on flavour.",
  },
];

export default chefs;