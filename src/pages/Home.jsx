import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero/Hero";
import CategoryStrip from "../components/Categories/CategoryStrip";
import MealsSection from "../components/Meals/MealsSection";
import ChefSection from "../components/Chef/ChefSection";
import SectionTitle from "../components/Common/SectionTitle";
import Button from "../components/Common/Button";
import { ROUTES } from "../utils/constants";

const STEPS = [
  {
    number: "01",
    title: "A home chef cooks it",
    description:
      "Every dish is made fresh in a real home kitchen by a verified home chef — not a commercial kitchen line.",
  },
  {
    number: "02",
    title: "Packed with care",
    description:
      "Sealed hot and packed like a tiffin the moment your order comes in, so nothing sits around waiting.",
  },
  {
    number: "03",
    title: "Delivered while it's hot",
    description:
      "On your table within the hour — no reheating, no compromise on what left the kitchen.",
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Hero />

      <CategoryStrip />

      <section className="container mx-auto px-4 py-20">
        <SectionTitle
          eyebrow="How it works"
          title="From their kitchen to your door"
          subtitle="No commercial kitchens, no assembly lines — just a home chef cooking one order at a time."
        />

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="relative rounded-2xl border border-ink/10 p-6 dark:border-gray-700">
              <span className="font-display text-4xl font-semibold text-turmeric/70">
                {step.number}
              </span>
              <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
              <p className="mt-3 text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <MealsSection />

      <ChefSection />

      <section className="relative overflow-hidden bg-ink py-20 text-center text-rice">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(227,167,46,0.2), transparent 45%), radial-gradient(circle at 80% 70%, rgba(63,107,69,0.25), transparent 50%)",
          }}
        />

        <div className="container relative mx-auto px-4">
          <h2 className="font-display text-4xl font-semibold md:text-5xl">
            Craving something
            <br />
            home-cooked tonight?
          </h2>

          <p className="mt-4 text-rice/60">Order your favourite meals today</p>

          <div className="mt-8">
            <Button onClick={() => navigate(ROUTES.MENU)} className="!bg-turmeric !text-ink hover:!bg-turmeric/90">
              Explore Meals
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;