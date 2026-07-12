import { useState } from "react";
import chefs from "../../data/chefs";
import Input from "../Common/Input";

const EMPTY_FORM = {
  name: "",
  category: "",
  price: "",
  originalPrice: "",
  isVeg: true,
  chefId: "",
  image: "",
  description: "",
};

// Shared Add/Edit form, rendered inside a Modal by ManageMeals.
// `meal` present -> edit mode (fields pre-filled, id preserved on submit).
const MealForm = ({ meal, categories, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState(
    meal
      ? {
          name: meal.name,
          category: meal.category,
          price: String(meal.price),
          originalPrice: meal.originalPrice ? String(meal.originalPrice) : "",
          isVeg: meal.isVeg,
          chefId: meal.chefId ? String(meal.chefId) : "",
          image: meal.image,
          description: meal.description,
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.category) newErrors.category = "Pick a category";
    if (!form.price || Number(form.price) <= 0) newErrors.price = "Enter a valid price";
    if (form.originalPrice && Number(form.originalPrice) <= Number(form.price))
      newErrors.originalPrice = "Original price must be higher than the price";
    if (!form.image.trim()) newErrors.image = "Image URL is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      isVeg: form.isVeg,
      chefId: form.chefId ? Number(form.chefId) : null,
      image: form.image.trim(),
      description: form.description.trim(),
    });
  };

  const selectClassName =
    "w-full rounded-xl border px-4 py-3 outline-none transition-colors focus:ring-2 focus:ring-orange-500 dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Meal Name" name="name" value={form.name} onChange={handleChange} error={errors.name} required />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category <span className="text-red-500">*</span>
        </label>
        <select name="category" value={form.category} onChange={handleChange} className={selectClassName}>
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
      </div>

      <Input
        label="Price (₹)"
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        error={errors.price}
        required
      />

      <Input
        label="Original Price (₹) — optional, for showing a discount"
        name="originalPrice"
        type="number"
        value={form.originalPrice}
        onChange={handleChange}
        error={errors.originalPrice}
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Chef (optional)
        </label>
        <select name="chefId" value={form.chefId} onChange={handleChange} className={selectClassName}>
          <option value="">No chef</option>
          {chefs.map((chef) => (
            <option key={chef.id} value={chef.id}>
              {chef.name}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Image URL"
        name="image"
        value={form.image}
        onChange={handleChange}
        error={errors.image}
        required
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className={`${selectClassName} ${errors.description ? "border-red-500 focus:ring-red-500" : ""}`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="isVeg"
          checked={form.isVeg}
          onChange={handleChange}
          className="h-4 w-4 accent-orange-500"
        />
        Vegetarian
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border px-5 py-3 font-semibold hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : meal ? "Save Changes" : "Add Meal"}
        </button>
      </div>
    </form>
  );
};

export default MealForm;