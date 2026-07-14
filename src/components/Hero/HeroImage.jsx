import { useEffect, useRef, useState } from "react";

// Cycles through four moments of the HomeFeast story - a general welcome
// shot first, then Meals / Chefs / Reviews. Each of the last three doubles
// as a shortcut: clicking it smooth-scrolls to that part of the homepage.
// Every slide uses a real photo (stylish ceramic/ restaurant-style plating,
// never steel thalis) with an onError fallback to a gradient+icon card, so
// a slow or blocked image never shows a broken icon or blank box.
const SLIDES = [
  {
    id: null, // first slide is just the brand/welcome shot - no scroll target
    label: "HomeFeast",
    icon: "🏠",
    image:
      "https://images.unsplash.com/photo-1606843046080-45bf7a23c39f?auto=format&fit=crop&w=1000&q=80",
    alt: "A beautifully plated home-cooked Indian meal on a white ceramic plate",
    gradient: ["#c9752f", "#1c1712"],
  },
  {
    id: "meals",
    label: "Top Meals",
    icon: "🍽️",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=80",
    alt: "A restaurant-style dish beautifully plated on a white ceramic plate",
    gradient: ["#3f6b45", "#1c1712"],
  },
  {
    id: "chefs",
    label: "Top Chefs",
    icon: "👨‍🍳",
    image:
      "https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=1000&q=80",
    alt: "A home chef cooking in the kitchen",
    gradient: ["#e3a72e", "#1c1712"],
  },
  {
    id: "reviews",
    label: "Top Reviews",
    icon: "⭐",
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=80",
    alt: "Happy customers enjoying a meal together",
    gradient: ["#c9752f", "#1c1712"],
  },
];

const SLIDE_DURATION_MS = 4500;

// Shown in place of a slide's photo only if that photo URL fails to load -
// pure code (gradient + emoji), zero network dependency, so the hero can
// never show a broken-image icon or a blank box.
const SlideFallback = ({ slide }) => (
  <svg viewBox="0 0 500 420" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id={`grad-${slide.label}`} cx="50%" cy="35%" r="75%">
        <stop offset="0%" stopColor={slide.gradient[0]} stopOpacity="0.9" />
        <stop offset="100%" stopColor={slide.gradient[1]} />
      </radialGradient>
    </defs>
    <rect width="500" height="420" fill={`url(#grad-${slide.label})`} />
    <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" fontSize="120">
      {slide.icon}
    </text>
  </svg>
);

const HeroImage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failedSlides, setFailedSlides] = useState({});
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
    <div className="relative mx-auto max-w-md md:max-w-none">
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
        className="group relative block w-full overflow-hidden rounded-[2.5rem] shadow-2xl"
        aria-label={activeSlide.id ? `Jump to the ${activeSlide.label} section` : activeSlide.label}
      >
        <div className="relative h-[420px] w-full">
          {SLIDES.map((slide, index) => (
            <div
              key={slide.label}
              className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${
                index === activeIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              {failedSlides[slide.label] ? (
                <SlideFallback slide={slide} />
              ) : (
                <img
                  src={slide.image}
                  alt={slide.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  onError={() =>
                    setFailedSlides((prev) => ({ ...prev, [slide.label]: true }))
                  }
                  className="h-full w-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
                />
              )}
            </div>
          ))}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
          />

          <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full bg-rice/90 px-4 py-2 text-sm font-semibold text-ink shadow-lg backdrop-blur transition group-hover:bg-rice">
            <span>{activeSlide.icon}</span>
            <span>{activeSlide.label}</span>
            {activeSlide.id && <span className="text-turmeric">→</span>}
          </div>

          <div className="absolute bottom-6 right-6 flex gap-1.5">
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
      </button>

      <div className="absolute -bottom-6 -left-6 rounded-2xl bg-rice p-5 text-ink shadow-xl">
        <p className="text-xs font-semibold tracking-wide text-ink/50 uppercase">
          Customer rating
        </p>
        <h3 className="mt-1 font-display text-2xl font-semibold text-curry">
          4.9 / 5
        </h3>
        <p className="text-xs text-ink/50">From 2,000+ reviews</p>
      </div>
    </div>
  );
};

export default HeroImage;