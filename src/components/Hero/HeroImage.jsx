import { useEffect, useRef, useState } from "react";

// Cycles through four moments of the HomeFeast story - Welcome, then
// Meals / Chefs / Reviews - each with its own dedicated photo, headline,
// and description, plus a click-to-scroll shortcut to that part of the
// homepage. Kept as a plain, direct <img> with no loading-state gating.
// The wrapper is a plain w-full (not max-w-md) so the card always fills
// its full grid column on every screen size, instead of shrinking to a
// narrow phone-shaped card and leaving empty space around it.
const SLIDES = [
  {
    id: null,
    label: "HomeFeast",
    icon: "🍛",
    image:
      "https://images.unsplash.com/photo-1606843046080-45bf7a23c39f?auto=format&fit=crop&w=1200&q=80",
    alt: "A beautifully plated home-cooked meal on a white ceramic plate",
    title: "Home-cooked meals, from real kitchens",
    description:
      "HomeFeast connects you with verified home chefs cooking fresh, honest food — no cloud kitchens, no shortcuts.",
  },
  {
    id: "meals",
    label: "Top Meals",
    icon: "🍽️",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=80",
    alt: "A beautifully plated, restaurant-style dish",
    title: "Our top-rated meals",
    description:
      "From creamy Paneer Butter Masala to fiery Butter Chicken — dishes rated 4.5★ and above by real customers.",
  },
  {
    id: "chefs",
    label: "Top Chefs",
    icon: "👨‍🍳",
    image:
      "https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=1200&q=80",
    alt: "A home chef cooking in the kitchen",
    title: "Meet our top chefs",
    description:
      "Every meal is cooked by a verified home chef in their own kitchen, using their own family recipes.",
  },
  {
    id: "reviews",
    label: "Top Reviews",
    icon: "⭐",
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
    alt: "A group of happy customers enjoying a meal together",
    title: "Loved by 500+ customers",
    description:
      "Real reviews, real ratings — see why customers keep coming back to HomeFeast, order after order.",
  },
];

const SLIDE_DURATION_MS = 5000;

const HeroImage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (paused) return undefined;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION_MS);

    return () => clearInterval(timerRef.current);
  }, [paused]);

  const goToSection = (sectionId) => {
    if (!sectionId) return;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeSlide = SLIDES[activeIndex];

  return (
    <div className="w-full">
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute -top-6 left-1/2 h-10 w-24 -translate-x-1/2 rounded-t-full border-4 border-b-0 border-rice/15"
        />
        <div
          aria-hidden="true"
          className="absolute -inset-x-6 top-10 -bottom-10 -z-10 rounded-[2.5rem] bg-curry/50 rotate-[-4deg]"
        />
        <div
          aria-hidden="true"
          className="absolute -inset-x-3 top-6 -bottom-6 -z-10 rounded-[2.5rem] bg-turmeric/40 rotate-[3deg]"
        />

        <button
          type="button"
          onClick={() => goToSection(activeSlide.id)}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="group relative block w-full overflow-hidden rounded-[2.5rem] bg-ink shadow-2xl"
          aria-label={activeSlide.id ? `Jump to the ${activeSlide.label} section` : activeSlide.label}
        >
          <img
            src={activeSlide.image}
            alt={activeSlide.alt}
            className="h-[440px] w-full object-cover sm:h-[480px] lg:h-[520px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 p-6 text-left sm:p-8">
            <h3 className="font-display text-2xl font-semibold text-rice sm:text-3xl">
              {activeSlide.title}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-rice/80 sm:text-base">
              {activeSlide.description}
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="flex items-center gap-2 rounded-full bg-rice/90 px-4 py-1.5 text-xs font-semibold text-ink sm:text-sm">
                <span>{activeSlide.icon}</span>
                <span>{activeSlide.label}</span>
                {activeSlide.id && <span className="text-turmeric">→</span>}
              </span>

              <div className="flex gap-1.5">
                {SLIDES.map((slide, index) => (
                  <span
                    key={slide.label}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeIndex ? "w-6 bg-rice" : "w-1.5 bg-rice/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Customer rating - sits BESIDE the card, never overlapping it */}
      <div className="mt-4 flex items-center gap-4 rounded-2xl bg-rice px-5 py-4 text-ink shadow-xl sm:px-6 sm:py-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-turmeric/20 text-2xl">
          ⭐
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Customer rating
          </p>
          <p className="font-display text-xl font-semibold text-curry">
            4.9 / 5 <span className="text-sm font-normal text-ink/50">from 2,000+ reviews</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;