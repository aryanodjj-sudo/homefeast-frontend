import { useNavigate } from "react-router-dom";
import SectionTitle from "../Common/SectionTitle";

const CATEGORIES = [
  {
    name: "Indian",
    tagline: "Rich, slow-cooked gravies",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Rice",
    tagline: "Dum-cooked & fragrant",
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "South Indian",
    tagline: "Crisp, steamed, comforting",
    image:
      "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Snacks",
    tagline: "Street-food favourites",
    image:
      "https://images.unsplash.com/photo-1753357303396-704b5abe8945?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Desserts",
    tagline: "A sweet finish",
    image:
      "https://images.unsplash.com/photo-1593701461250-d7b22dfd3a77?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Beverages",
    tagline: "Cool, refreshing sips",
    image:
      "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=400&q=80",
  },
];

const CategoryStrip = () => {
  const navigate = useNavigate();

  const goToCategory = (categoryName) => {
    navigate("/menu", { state: { category: categoryName } });
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <SectionTitle
        eyebrow="What are you craving"
        title="Explore by category"
        subtitle="Six kitchens' worth of home cooking, sorted the way you'd actually order it."
      />

      <div className="flex gap-5 overflow-x-auto pb-2 md:grid md:grid-cols-6 md:overflow-visible">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            type="button"
            onClick={() => goToCategory(cat.name)}
            className="group w-32 flex-shrink-0 text-center md:w-auto"
          >
            <div className="mx-auto h-24 w-24 overflow-hidden rounded-full ring-4 ring-transparent transition group-hover:ring-turmeric/40 md:h-28 md:w-28">
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
              />
            </div>
            <p className="mt-3 font-semibold text-ink dark:text-rice">{cat.name}</p>
            <p className="mt-0.5 text-xs text-gray-500">{cat.tagline}</p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryStrip;