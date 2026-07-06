import { useEffect, useState } from "react";
import { categoriesAPI } from "../../utils/api";
import useMeals from "../../hooks/useMeals";
import Loader from "../../components/Common/Loader";
import Alert from "../../components/Common/Alert";

const ManageCategories = () => {
  const { meals } = useMeals();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newCategory, setNewCategory] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoriesAPI.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCategories();
  }, []);

  // How many meals currently use each category - shown so an admin doesn't
  // delete a category that's still in active use without realizing it.
  const countForCategory = (name) => meals.filter((m) => m.category === name).length;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setAdding(true);
    setError(null);

    try {
      await categoriesAPI.createCategory(newCategory);
      setNewCategory("");
      await loadCategories();
    } catch (err) {
      setError(err.message || "Could not add category");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (category) => {
    const inUse = countForCategory(category.name);
    if (inUse > 0) {
      const confirmed = window.confirm(
        `${inUse} meal(s) still use "${category.name}". Delete anyway?`
      );
      if (!confirmed) return;
    }

    setDeletingId(category.id);
    try {
      await categoriesAPI.deleteCategory(category.id);
      await loadCategories();
    } catch (err) {
      setError(err.message || "Could not delete category");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Categories</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
      </p>

      {error && (
        <div className="mt-4">
          <Alert type="error" message={error} />
        </div>
      )}

      <form onSubmit={handleAdd} className="mt-6 flex max-w-md gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={adding || !newCategory.trim()}
          className="shrink-0 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {adding ? "Adding..." : "Add"}
        </button>
      </form>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between rounded-xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div>
              <p className="font-medium">{category.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {countForCategory(category.name)} meal(s)
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(category)}
              disabled={deletingId === category.id}
              className="text-sm font-medium text-red-500 hover:underline disabled:opacity-60"
            >
              {deletingId === category.id ? "..." : "Delete"}
            </button>
          </div>
        ))}

        {categories.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">No categories yet.</p>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;