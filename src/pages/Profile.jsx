import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";
import useOrders from "../hooks/useOrders";
import { authAPI } from "../utils/api";
import { validateProfileForm, hasErrors } from "../utils/validators";
import { formatDate } from "../utils/formatDate";
import { ROUTES } from "../utils/constants";
import Input from "../components/Common/Input";
import Button from "../components/Common/Button";
import Alert from "../components/Common/Alert";
import LogoutButton from "../components/Common/LogoutButton";

// Initials avatar - no image upload flow yet, so a simple letter avatar
// avoids a broken-image placeholder for every user.
const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { orders } = useOrders();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setForm({ name: user?.name || "", phone: user?.phone || "" });
    setErrors({});
    setFeedback(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const validationErrors = validateProfileForm(form);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setSaving(true);

    try {
      const { user: updatedUser } = await authAPI.updateProfile({
        userId: user.id,
        name: form.name,
        phone: form.phone,
      });

      updateUser(updatedUser);
      setIsEditing(false);
      setFeedback({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setFeedback({ type: "error", text: err.message || "Could not update profile." });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">My Profile</h1>

      {feedback && (
        <div className="mt-4">
          <Alert type={feedback.type} message={feedback.text} />
        </div>
      )}

      <div className="mt-6 rounded-2xl border p-6 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-600 dark:bg-orange-500/10">
            {getInitials(user.name) || "?"}
          </div>
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
            />

            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="rounded-xl border px-5 py-3 font-semibold transition hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between border-b pb-3 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Phone</span>
              <span className="font-medium">{user.phone || "Not added"}</span>
            </div>
            <div className="flex justify-between border-b pb-3 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Member Since</span>
              <span className="font-medium">{formatDate(user.createdAt) || "—"}</span>
            </div>

            <button
              type="button"
              onClick={handleEdit}
              className="mt-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link
          to={ROUTES.ORDERS}
          className="rounded-2xl border p-5 text-center transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <p className="text-2xl font-bold text-orange-500">{orders.length}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Orders</p>
        </Link>
        <Link
          to={ROUTES.WISHLIST}
          className="rounded-2xl border p-5 text-center transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <p className="text-2xl font-bold text-orange-500">{wishlist.length}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Wishlist</p>
        </Link>
        <Link
          to={ROUTES.CART}
          className="rounded-2xl border p-5 text-center transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <p className="text-2xl font-bold text-orange-500">{totalItems}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Items in Cart</p>
        </Link>
      </div>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Profile;