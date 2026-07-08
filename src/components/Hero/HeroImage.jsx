// Signature element: a stack of offset tiers behind the photo, echoing a
// tiffin carrier (dabba) - the everyday object of home-cooked food being
// carried and delivered, which is exactly HomeFeast's story. The same
// three-tier motif reappears in miniature as the eyebrow mark on other
// sections of the home page.
const HERO_PHOTO_URL =
  "https://images.unsplash.com/photo-1742281257687-092746ad6021?auto=format&fit=crop&w=1000&q=80";

const HeroImage = () => {
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

      <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl">
        <img
          src={HERO_PHOTO_URL}
          alt="A traditional home-cooked Indian thali, freshly plated"
          className="h-[420px] w-full object-cover"
        />
      </div>

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