const MealSort = ({ sort, setSort }) => {
  return (
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value)}
      aria-label="Sort meals"
      className="rounded-xl border px-4 py-2"
    >
      <option value="default">Default</option>
      <option value="low">Price Low to High</option>
      <option value="high">Price High to Low</option>
      <option value="rating">Top Rated</option>
    </select>
  );
};

export default MealSort;