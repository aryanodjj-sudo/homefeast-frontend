import { useEffect, useRef, useState } from "react";

// Cycles through three moments of the HomeFeast story instead of one static
// thali photo. Each slide doubles as a shortcut - clicking it smooth-scrolls
// to that part of the homepage (Meals / Chefs / Reviews sections below).
//
// These are self-contained inline SVG illustrations, not hotlinked photos.
// Earlier versions used external stock-photo URLs (Unsplash / Picsum) which
// kept failing to load depending on network/browser conditions. An inline
// SVG has zero network dependency - it's just code, so it can never show a
// broken image icon or a blank box, on any connection.
const SLIDES = [
  {
    id: "meals",
    label: "Top Meals",
    icon: "🍽️",
    gradient: ["#3f6b45", "#1c1712"],
    emoji: "🍛",
    alt: "A full thali plate with a variety of home-cooked dishes",
  },
  {
    id: "chefs",
    label: "Top Chefs",
    icon: "👨‍🍳",
    gradient: ["#e3a72e", "#1c1712"],
    emoji: "👨‍🍳",
    alt: "A home chef cooking in the kitchen",
  },
  {
    id: "reviews",
    label: "Top Reviews",
    icon: "⭐",
    gradient: ["#c9752f", "#1c1712"],
    emoji: "⭐",
    alt: "Happy customers enjoying a meal together",
  },
];

const SLIDE_DURATION_MS = 4500;

// Renders one slide as a gradient + big emoji SVG - pure code, no <img>, no
// network request, so it always renders instantly on every device.
const SlideArt = ({ slide }) => (
  <svg viewBox="0 0 500 420" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id={`grad-${slide.id}`} cx="50%" cy="35%" r="75%">
        <stop offset="0%" stopColor={slide.gradient[0]} stopOpacity="0.9" />
        <stop offset="100%" stopColor={slide.gradient[1]} />
      </radialGradient>
    </defs>
    <rect width="500" height="420" fill={`url(#grad-${slide.id})`} />
    <circle cx="120" cy="90" r="70" fill="#fbf7f0" opacity="0.06" />
    <circle cx="410" cy="320" r="110" fill="#fbf7f0" opacity="0.06" />
    <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" fontSize="140">
      {slide.emoji}
    </text>
  </svg>
);

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
        aria-label={`Jump to the ${activeSlide.label} section`}
      >
        <div className="relative h-[420px] w-full">
          {SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              role="img"
              aria-label={slide.alt}
              className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out group-hover:scale-105 ${
                index === activeIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionProperty: "opacity, transform" }}
            >
              <SlideArt slide={slide} />
            </div>
          ))}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
          />

          <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full bg-rice/90 px-4 py-2 text-sm font-semibold text-ink shadow-lg backdrop-blur transition group-hover:bg-rice">
            <span>{activeSlide.icon}</span>
            <span>{activeSlide.label}</span>
            <span className="text-turmeric">→</span>
          </div>

          <div className="absolute bottom-6 right-6 flex gap-1.5">
            {SLIDES.map((slide, index) => (
              <span
                key={slide.id}
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