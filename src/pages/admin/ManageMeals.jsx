import { useEffect, useRef, useState } from "react";
import useMeals from "../../hooks/useMeals";
import { mealsAPI, categoriesAPI } from "../../utils/api";
import { formatPrice } from "../../utils/formatPrice";
import Loader from "../../components/Common/Loader";
import Alert from "../../components/Common/Alert";
import Modal from "../../components/Common/Modal";
import MealForm from "../../components/Admin/MealForm";

const ManageMeals = () => {
  const { meals, loading, error, refreshMeals } = useMeals();
  const [categories, setCategories] = useState([]);

  const [modalMode, setModalMode] = useState(null); // "add" | "edit" | null
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);

  // Closes the double-click race: React state (`submitting`) only disables
  // the button after a re-render, and a fast double-click can fire twice
  // before that re-render happens - that's exactly what was creating two
  // identical meals from one "Add Meal" click. A ref updates synchronously,
  // so the second click is rejected immediately, before any state update.
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    categoriesAPI.getCategories().then(setCategories);
  }, []);

  const openAdd = () => {
    setSelectedMeal(null);
    setModalMode("add");
  };

  const openEdit = (meal) => {
    setSelectedMeal(meal);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedMeal(null);
    setActionError(null);
  };

  const handleSubmit = async (mealData) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setSubmitting(true);
    setActionError(null);

    try {
      if (modalMode === "edit") {
        await mealsAPI.updateMeal(selectedMeal.id, mealData);
      } else {
        await mealsAPI.createMeal(mealData);
      }
      await refreshMeals();
      closeModal();
    } catch (err) {
      setActionError(err.message || "Could not save meal");
    } finally {
      isSubmittingRef.current = false;
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setSubmitting(true);

    try {
      await mealsAPI.deleteMeal(deleteTarget.id);
      await refreshMeals();
      setDeleteTarget(null);
    } catch (err) {
      setActionError(err.message || "Could not delete meal");
    } finally {
      isSubmittingRef.current = false;
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Meals</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {meals.length} meal{meals.length !== 1 ? "s" : ""} on the menu
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
        >
          + Add Meal
        </button>
      </div>

      {error && (
        <div className="mt-4">
          <Alert type="error" message={error} />
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border bg-white dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Meal</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr key={meal.id} className="border-b last:border-0 dark:border-gray-800">
                <td className="flex items-center gap-3 px-4 py-3">
                  <img src={meal.image} alt={meal.name} className="h-10 w-10 rounded-lg object-cover" />
                  <span className="font-medium">{meal.name}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{meal.category}</td>
                <td className="px-4 py-3 font-medium">{formatPrice(meal.price)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      meal.isVeg
                        ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    }`}
                  >
                    {meal.isVeg ? "Veg" : "Non-Veg"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => openEdit(meal)}
                    className="mr-3 font-medium text-orange-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(meal)}
                    className="font-medium text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {meals.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">
                  No meals yet. Add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalMode && (
        <Modal close={closeModal} title={modalMode === "edit" ? "Edit Meal" : "Add Meal"}>
          {actionError && (
            <div className="mb-4">
              <Alert type="error" message={actionError} />
            </div>
          )}
          <MealForm
            meal={selectedMeal}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitting={submitting}
          />
        </Modal>
      )}

      {deleteTarget && (
        <Modal close={() => setDeleteTarget(null)} title="Delete this meal?">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            "{deleteTarget.name}" will be removed from the menu. This can't be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="rounded-xl border px-4 py-2 font-medium dark:border-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={submitting}
              className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 disabled:opacity-60"
            >
              {submitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManageMeals;