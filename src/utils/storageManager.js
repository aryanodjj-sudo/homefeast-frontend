import { getStorageItem, setStorageItem } from "./storage";
import { STORAGE_KEYS, USER_ROLES, SEED_ADMIN } from "./constants";
import staticMeals from "../data/meals";

// Acts as a tiny local "users table" so Login/Register can work end-to-end
// before the real backend (Step 11) exists.
// Only utils/api.js should import this file - pages/components should always
// go through api.js and never touch storage directly.

export const getStoredUsers = () => getStorageItem(STORAGE_KEYS.USERS_DB, []);

export const saveStoredUsers = (users) => setStorageItem(STORAGE_KEYS.USERS_DB, users);

export const findUserByEmail = (email) => {
  const users = getStoredUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

export const addStoredUser = (user) => {
  const users = getStoredUsers();
  const updatedUsers = [...users, user];
  saveStoredUsers(updatedUsers);
  return user;
};

// Merges `updates` into the stored user record with the given id.
// Returns the updated user, or null if no such user exists.
export const updateStoredUser = (userId, updates) => {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) return null;

  const updatedUser = { ...users[index], ...updates };
  const updatedUsers = [...users];
  updatedUsers[index] = updatedUser;

  saveStoredUsers(updatedUsers);
  return updatedUser;
};

// Creates the default admin account (see SEED_ADMIN in constants.js) once,
// the first time the app runs on a fresh browser. Safe to call on every
// app load - it's a no-op once the account already exists.
export const seedAdminUser = () => {
  if (findUserByEmail(SEED_ADMIN.email)) return;

  addStoredUser({
    id: crypto.randomUUID(),
    name: "Admin",
    email: SEED_ADMIN.email,
    phone: "",
    password: SEED_ADMIN.password,
    role: USER_ROLES.ADMIN,
    createdAt: new Date().toISOString(),
  });
};

// ---------------------------------------------------------------------------
// Meals "table" - seeded once from the static catalog so the Admin Panel has
// something mutable to work with. Everything else (Menu, Home, Meal Details)
// reads through mealsAPI, which reads through here, so an admin edit shows
// up on the storefront immediately without a page-specific data path.
// ---------------------------------------------------------------------------
export const getStoredMeals = () => {
  const stored = getStorageItem(STORAGE_KEYS.MEALS, null);
  if (stored !== null) return stored;

  // First run: seed from the static catalog and persist it.
  setStorageItem(STORAGE_KEYS.MEALS, staticMeals);
  return staticMeals;
};

export const saveStoredMeals = (meals) => setStorageItem(STORAGE_KEYS.MEALS, meals);

// ---------------------------------------------------------------------------
// Categories "table" - seeded from whatever categories already exist across
// the static meal catalog, then editable independently (a category can exist
// with zero meals in it, e.g. right after creation).
// ---------------------------------------------------------------------------
export const getStoredCategories = () => {
  const stored = getStorageItem(STORAGE_KEYS.CATEGORIES, null);
  if (stored !== null) return stored;

  const uniqueNames = [...new Set(staticMeals.map((m) => m.category))];
  const seeded = uniqueNames.map((name) => ({ id: crypto.randomUUID(), name }));
  setStorageItem(STORAGE_KEYS.CATEGORIES, seeded);
  return seeded;
};

export const saveStoredCategories = (categories) =>
  setStorageItem(STORAGE_KEYS.CATEGORIES, categories);

// ---------------------------------------------------------------------------
// Reviews "table" - no customer-facing "write a review" UI yet (that's the
// rest of Phase 7), so this seeds a small set of sample reviews purely so
// the Manage Reviews admin screen has real data to moderate against.
// ---------------------------------------------------------------------------
const SAMPLE_REVIEWS = [
  { mealId: 1, author: "Aarav Sharma", rating: 5, comment: "Absolutely loved the Paneer Butter Masala, tasted homemade!" },
  { mealId: 1, author: "Priya Nair", rating: 4, comment: "Great flavour, could be a bit less sweet for my taste." },
  { mealId: 4, author: "Rohit Verma", rating: 5, comment: "Best Butter Chicken I've had delivered to my door." },
  { mealId: 3, author: "Sneha Iyer", rating: 4, comment: "Crispy dosa, sambar was a little watery though." },
];

export const getStoredReviews = () => {
  const stored = getStorageItem(STORAGE_KEYS.REVIEWS, null);
  if (stored !== null) return stored;

  const seeded = SAMPLE_REVIEWS.map((r) => ({
    id: crypto.randomUUID(),
    status: "Published",
    createdAt: new Date().toISOString(),
    ...r,
  }));
  setStorageItem(STORAGE_KEYS.REVIEWS, seeded);
  return seeded;
};

export const saveStoredReviews = (reviews) => setStorageItem(STORAGE_KEYS.REVIEWS, reviews);

// ---------------------------------------------------------------------------
// Contact messages "table" - customer queries submitted from the Contact
// page, moderated from the Manage Messages admin screen.
// ---------------------------------------------------------------------------
export const getStoredMessages = () => getStorageItem(STORAGE_KEYS.MESSAGES, []);

export const saveStoredMessages = (messages) => setStorageItem(STORAGE_KEYS.MESSAGES, messages);