import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";

// The ink backdrop panel is the page's opening thesis: a dark, kitchen-at-
// night band that the hero photo and headline sit inside, closed off with a
// deep rounded corner so the rest of the page reads as "rice" (light) by
// contrast. Only two places on the page use this ink treatment - here and
// the closing CTA - so it stays a structural accent, not a full dark theme.
const Hero = () => {
  return (
    <section className="relative overflow-hidden rounded-b-[2.5rem] bg-ink text-rice sm:rounded-b-[3.5rem]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 20%, rgba(227,167,46,0.18), transparent 45%), radial-gradient(circle at 88% 75%, rgba(63,107,69,0.22), transparent 50%)",
        }}
      />

      <div className="container relative mx-auto grid gap-14 px-4 py-20 md:grid-cols-2 md:items-center md:py-28">
        <HeroContent />
        <HeroImage />
      </div>
    </section>
  );
};

export default Hero;