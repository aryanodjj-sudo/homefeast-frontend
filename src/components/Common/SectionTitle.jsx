// Shared section header. The three-dot mark echoes the tiffin-stack motif
// from the hero image, so every section on the page carries a small trace
// of the same signature rather than a generic bullet or numbered marker.
// `tone="dark"` is for use on the ink-backed CTA band; every other section
// uses the default light tone.
const SectionTitle = ({ eyebrow, title, subtitle, tone = "light", align = "center" }) => {
  const isDark = tone === "dark";
  const alignment = align === "left" ? "text-left" : "text-center mx-auto";

  return (
    <div className={`mb-12 max-w-2xl ${alignment}`}>
      {eyebrow && (
        <div
          className={`mb-4 flex items-center gap-2 text-xs font-semibold tracking-wide uppercase ${
            align === "left" ? "" : "justify-center"
          } ${isDark ? "text-turmeric" : "text-curry"}`}
        >
          <span className="flex gap-0.5" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-40" />
          </span>
          {eyebrow}
        </div>
      )}

      <h2
        className={`font-display text-3xl font-semibold md:text-4xl ${
          isDark ? "text-rice" : "text-ink"
        }`}
      >
        {title}
      </h2>

      {subtitle && (
        <p className={`mt-3 text-base ${isDark ? "text-rice/60" : "text-gray-500"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;