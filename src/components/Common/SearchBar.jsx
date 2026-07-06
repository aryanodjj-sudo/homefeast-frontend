const SearchBar = ({
  value,
  onChange,
  placeholder = "Search meals...",
  ariaLabel = "Search meals",
  className = "",
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="
          w-full
          rounded-xl
          border
          py-3
          pl-11
          pr-11
          outline-none
          transition-colors
          focus:ring-2
          focus:ring-orange-500
          dark:bg-gray-900
          dark:text-white
          border-gray-300
          dark:border-gray-700
        "
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;