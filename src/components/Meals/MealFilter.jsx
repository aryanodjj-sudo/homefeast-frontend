// Category filter dropdown.
// `categories` is passed in by the parent (derived from the live meal data)
// instead of being hardcoded here, so this stays correct as new categories
// are added to the catalog.
const MealFilter = ({ category, setCategory, categories = ["All"] }) => {
  return (
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      aria-label="Filter by category"
      className="rounded-xl border px-4 py-2"
    >
      {categories.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};

export default MealFilter;