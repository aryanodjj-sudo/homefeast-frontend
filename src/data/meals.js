// Static meal catalog for HomeFeast.
// This stands in for a real menu/products API until the backend (Step 11) exists.
// Each meal is prepared by a home chef — chefId links to the chefs in ./chefs.js
// so the Meal Details page can show "Prepared by <chef>". chefId is optional;
// meals without one simply skip that section.
const meals = [
  {
    id: 1,
    name: "Paneer Butter Masala",
    category: "Indian",
    price: 250,
    rating: 4.8,
    isVeg: true,
    chefId: 1,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
    description:
      "Soft paneer cubes simmered in a rich, creamy tomato-butter gravy, finished with a touch of cream and kasuri methi. A North Indian favourite best enjoyed with butter naan or steamed rice.",
  },
  {
    id: 2,
    name: "Veg Biryani",
    category: "Rice",
    price: 180,
    rating: 4.7,
    isVeg: true,
    chefId: 1,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0",
    description:
      "Fragrant basmati rice layered and dum-cooked with mixed vegetables, whole spices, and fried onions. Served with raita on the side for a complete, comforting meal.",
  },
  {
    id: 3,
    name: "Masala Dosa",
    category: "South Indian",
    price: 120,
    rating: 4.6,
    isVeg: true,
    chefId: 2,
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921",
    description:
      "A crisp, golden rice-and-lentil crepe folded over a spiced potato filling, served with coconut chutney and piping hot sambar.",
  },
  {
    id: 4,
    name: "Butter Chicken",
    category: "Indian",
    price: 280,
    rating: 4.9,
    isVeg: false,
    chefId: 1,
    image: "https://images.unsplash.com/photo-1742599361498-79824d24e355",
    description:
      "Tender tandoor-grilled chicken simmered in a velvety, mildly spiced tomato-butter sauce. A restaurant classic, made the homemade way.",
  },
  {
    id: 5,
    name: "Idli Sambhar",
    category: "South Indian",
    price: 100,
    rating: 4.5,
    isVeg: true,
    chefId: 2,
    image: "https://images.unsplash.com/photo-1741376509187-0b683c764294",
    description:
      "Soft, steamed rice cakes served with a hearty lentil-and-vegetable sambhar and fresh coconut chutney. A light, wholesome South Indian breakfast classic.",
  },
  {
    id: 6,
    name: "Pav Bhaji",
    category: "Snacks",
    price: 140,
    rating: 4.6,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1753357303396-704b5abe8945",
    description:
      "A buttery, spiced mash of mixed vegetables served with soft, toasted pav buns, chopped onions, and a wedge of lemon. Classic Mumbai street food, made fresh at home.",
  },
  {
    id: 7,
    name: "Gulab Jamun",
    category: "Desserts",
    price: 90,
    rating: 4.8,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1593701461250-d7b22dfd3a77",
    description:
      "Soft, golden khoya dumplings soaked in warm cardamom-and-rose sugar syrup. A classic Indian dessert that rounds off any meal on a sweet note.",
  },
  {
    id: 8,
    name: "Mango Lassi",
    category: "Beverages",
    price: 80,
    rating: 4.7,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4",
    description:
      "A thick, chilled yogurt smoothie blended with sweet Alphonso mango pulp. Refreshing, cooling, and the perfect companion to a spicy meal.",
  },
];

export default meals;