import { APP_CONFIG } from "./appConfig";
import { ORDER_STATUS, REVIEW_STATUS, MESSAGE_STATUS, STORAGE_KEYS, USER_ROLES, VALIDATION_MESSAGES } from "./constants";
import { getStorageItem, setStorageItem } from "./storage";
import {
  addStoredUser,
  findUserByEmail,
  updateStoredUser,
  getStoredUsers,
  getStoredMeals,
  saveStoredMeals,
  getStoredCategories,
  saveStoredCategories,
  getStoredReviews,
  saveStoredReviews,
  getStoredMessages,
  saveStoredMessages,
} from "./storageManager";
import { canCancelOrder, generateOrderId } from "./orderHelpers";

// ---------------------------------------------------------------------------
// Generic request helper - used once the real backend (Step 11) is connected.
// Every auth function below resolves to the SAME shape { user, token }
// regardless of whether USE_MOCK_API is true or false, so pages that call
// them never need to change when the backend goes live.
// ---------------------------------------------------------------------------
const request = async (endpoint, options = {}) => {
  const token = getStorageItem(STORAGE_KEYS.TOKEN, null);

  const response = await fetch(`${APP_CONFIG.API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }

  return data;
};

const mockDelay = () =>
  new Promise((resolve) => setTimeout(resolve, APP_CONFIG.MOCK_NETWORK_DELAY_MS));

// Small, non-cryptographic fake token so the rest of the app (which only
// checks "is there a token") behaves identically before and after Step 11.
const generateMockToken = (userId) => btoa(`${userId}.${Date.now()}.homefeast-mock`);

// Strips the password field before a mock user ever leaves this module.
const toSafeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  createdAt: user.createdAt,
});

// ---------------------------------------------------------------------------
// Auth API - flip APP_CONFIG.USE_MOCK_API to false once backend endpoints exist.
// ---------------------------------------------------------------------------
export const authAPI = {
  // Sends a 6-digit OTP to the given email. purpose is "register" or "login" -
  // the backend uses it to reject a register-OTP being replayed for login etc.
  sendOtp: async ({ email, purpose }) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email, purpose }),
      });
    }
    await mockDelay();
    console.info(`[Mock OTP] Use 123456 to verify ${email}`);
    return { success: true, mock: true };
  },

  verifyOtp: async ({ email, otp, purpose }) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp, purpose }),
      });
    }
    await mockDelay();
    if (otp !== "123456") {
      throw new Error("Invalid OTP. In mock mode use 123456.");
    }
    return { verifyToken: `mock-verified-${email}-${purpose}` };
  },

  googleAuth: async (credential) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential }),
      });
    }
    await mockDelay();
    throw new Error("Google sign-in needs the real backend. Set VITE_USE_MOCK_API=false.");
  },

  register: async ({ name, email, phone, password, verifyToken }) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, password, verifyToken }),
      });
    }

    await mockDelay();

    if (!verifyToken) {
      throw new Error("Please verify your email with the OTP first");
    }

    if (findUserByEmail(email)) {
      throw new Error(VALIDATION_MESSAGES.EMAIL_TAKEN);
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      password,
      role: USER_ROLES.CUSTOMER,
      createdAt: new Date().toISOString(),
    };

    addStoredUser(newUser);

    return { user: toSafeUser(newUser), token: generateMockToken(newUser.id) };
  },

  login: async ({ email, password, verifyToken }) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, verifyToken }),
      });
    }

    await mockDelay();

    if (!verifyToken) {
      throw new Error("Please verify your email with the OTP first");
    }

    const existingUser = findUserByEmail(email);

    if (!existingUser || existingUser.password !== password) {
      throw new Error(VALIDATION_MESSAGES.INVALID_CREDENTIALS);
    }

    return { user: toSafeUser(existingUser), token: generateMockToken(existingUser.id) };
  },

  logout: async () => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/auth/logout", { method: "POST" });
    }
    await mockDelay();
    return { success: true };
  },

  updateProfile: async ({ userId, name, phone }) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({ name, phone }),
      });
    }

    await mockDelay();

    const updatedUser = updateStoredUser(userId, {
      name: name.trim(),
      phone: phone?.trim() || "",
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return { user: toSafeUser(updatedUser) };
  },
};

// ---------------------------------------------------------------------------
// Orders API - flip APP_CONFIG.USE_MOCK_API to false once /orders endpoints
// exist on the real backend (Phase 4/5). The mock branch stores every user's
// orders in one localStorage array; getOrders always filters by userId so
// the shape returned to callers is identical to what a real API would scope
// server-side with req.user.id.
// ---------------------------------------------------------------------------
const getAllStoredOrders = () => getStorageItem(STORAGE_KEYS.ORDERS, []);
const saveAllStoredOrders = (orders) => setStorageItem(STORAGE_KEYS.ORDERS, orders);

export const ordersAPI = {
  getOrders: async (userId) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/orders");
    }

    await mockDelay();
    return getAllStoredOrders()
      .filter((order) => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getOrderById: async (orderId) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request(`/orders/${orderId}`);
    }

    await mockDelay();
    const order = getAllStoredOrders().find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");
    return order;
  },

  placeOrder: async ({ userId, items, address, paymentMethod, pricing, coupon }) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/orders", {
        method: "POST",
        body: JSON.stringify({ items, address, paymentMethod, pricing, coupon }),
      });
    }

    await mockDelay();

    const newOrder = {
      id: generateOrderId(),
      userId,
      items,
      address,
      paymentMethod,
      pricing,
      coupon: coupon?.code || null,
      status: ORDER_STATUS.PLACED,
      createdAt: new Date().toISOString(),
      statusHistory: [{ status: ORDER_STATUS.PLACED, at: new Date().toISOString() }],
    };

    const allOrders = getAllStoredOrders();
    saveAllStoredOrders([...allOrders, newOrder]);

    return newOrder;
  },

  cancelOrder: async (orderId) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request(`/orders/${orderId}/cancel`, { method: "PATCH" });
    }

    await mockDelay();

    const allOrders = getAllStoredOrders();
    const order = allOrders.find((o) => o.id === orderId);

    if (!order) throw new Error("Order not found");
    if (!canCancelOrder(order.status)) {
      throw new Error(`Order cannot be cancelled once it is "${order.status}"`);
    }

    const updatedOrder = {
      ...order,
      status: ORDER_STATUS.CANCELLED,
      statusHistory: [
        ...order.statusHistory,
        { status: ORDER_STATUS.CANCELLED, at: new Date().toISOString() },
      ],
    };

    saveAllStoredOrders(
      allOrders.map((o) => (o.id === orderId ? updatedOrder : o))
    );

    return updatedOrder;
  },

  // --- Admin-only ---------------------------------------------------------

  getAllOrders: async () => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/admin/orders");
    }

    await mockDelay();
    return getAllStoredOrders().sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  },

  updateOrderStatus: async (orderId, status) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request(`/admin/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    }

    await mockDelay();

    const allOrders = getAllStoredOrders();
    const order = allOrders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");

    const updatedOrder = {
      ...order,
      status,
      statusHistory: [...order.statusHistory, { status, at: new Date().toISOString() }],
    };

    saveAllStoredOrders(allOrders.map((o) => (o.id === orderId ? updatedOrder : o)));
    return updatedOrder;
  },
};

// ---------------------------------------------------------------------------
// Meals API - powers both the storefront (Menu, Home, Meal Details) and the
// admin Manage Meals screen off the SAME mutable store, seeded once from the
// static catalog in data/meals.js. This is what makes "Add/Edit/Delete Meals"
// in the admin panel actually show up for customers instead of being a dead-end demo.
// ---------------------------------------------------------------------------
export const mealsAPI = {
  getMeals: async () => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/meals");
    }
    await mockDelay();
    return getStoredMeals();
  },

  getMealById: async (id) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request(`/meals/${id}`);
    }
    await mockDelay();
    const meal = getStoredMeals().find((m) => String(m.id) === String(id));
    if (!meal) throw new Error("Meal not found");
    return meal;
  },

  createMeal: async (mealData) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/admin/meals", { method: "POST", body: JSON.stringify(mealData) });
    }
    await mockDelay();

    const meals = getStoredMeals();
    const newMeal = {
      id: Date.now(),
      rating: 0,
      ...mealData,
    };

    saveStoredMeals([...meals, newMeal]);
    return newMeal;
  },

  updateMeal: async (id, mealData) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request(`/admin/meals/${id}`, { method: "PATCH", body: JSON.stringify(mealData) });
    }
    await mockDelay();

    const meals = getStoredMeals();
    const index = meals.findIndex((m) => String(m.id) === String(id));
    if (index === -1) throw new Error("Meal not found");

    const updatedMeal = { ...meals[index], ...mealData };
    const updatedMeals = [...meals];
    updatedMeals[index] = updatedMeal;

    saveStoredMeals(updatedMeals);
    return updatedMeal;
  },

  deleteMeal: async (id) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request(`/admin/meals/${id}`, { method: "DELETE" });
    }
    await mockDelay();

    const meals = getStoredMeals();
    saveStoredMeals(meals.filter((m) => String(m.id) !== String(id)));
    return { success: true };
  },
};

// ---------------------------------------------------------------------------
// Categories API
// ---------------------------------------------------------------------------
export const categoriesAPI = {
  getCategories: async () => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/categories");
    }
    await mockDelay();
    return getStoredCategories();
  },

  createCategory: async (name) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/admin/categories", { method: "POST", body: JSON.stringify({ name }) });
    }
    await mockDelay();

    const categories = getStoredCategories();
    if (categories.some((c) => c.name.toLowerCase() === name.trim().toLowerCase())) {
      throw new Error("This category already exists");
    }

    const newCategory = { id: crypto.randomUUID(), name: name.trim() };
    saveStoredCategories([...categories, newCategory]);
    return newCategory;
  },

  deleteCategory: async (id) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request(`/admin/categories/${id}`, { method: "DELETE" });
    }
    await mockDelay();

    const categories = getStoredCategories();
    saveStoredCategories(categories.filter((c) => c.id !== id));
    return { success: true };
  },
};

// ---------------------------------------------------------------------------
// Reviews API - admin moderation + customer write/edit/delete-own-review.
// ---------------------------------------------------------------------------
export const reviewsAPI = {
  getReviews: async () => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/admin/reviews");
    }
    await mockDelay();
    return getStoredReviews().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getReviewsForMeal: async (mealId) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request(`/meals/${mealId}/reviews`);
    }
    await mockDelay();
    return getStoredReviews()
      .filter((r) => String(r.mealId) === String(mealId) && r.status === REVIEW_STATUS.PUBLISHED)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  createReview: async ({ mealId, userId, author, rating, comment }) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request(`/meals/${mealId}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating, comment }),
      });
    }
    await mockDelay();

    const reviews = getStoredReviews();
    const newReview = {
      id: crypto.randomUUID(),
      mealId,
      userId,
      author,
      rating,
      comment: comment.trim(),
      status: REVIEW_STATUS.PUBLISHED,
      createdAt: new Date().toISOString(),
    };

    saveStoredReviews([...reviews, newReview]);
    return newReview;
  },

  updateOwnReview: async (id, userId, { rating, comment }) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request(`/reviews/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ rating, comment }),
      });
    }
    await mockDelay();

    const reviews = getStoredReviews();
    const review = reviews.find((r) => r.id === id);
    if (!review) throw new Error("Review not found");
    if (review.userId !== userId) throw new Error("You can only edit your own review");

    const updated = { ...review, rating, comment: comment.trim() };
    saveStoredReviews(reviews.map((r) => (r.id === id ? updated : r)));
    return updated;
  },

  deleteOwnReview: async (id, userId) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request(`/reviews/${id}`, { method: "DELETE" });
    }
    await mockDelay();

    const reviews = getStoredReviews();
    const review = reviews.find((r) => r.id === id);
    if (!review) throw new Error("Review not found");
    if (review.userId !== userId) throw new Error("You can only delete your own review");

    saveStoredReviews(reviews.filter((r) => r.id !== id));
    return { success: true };
  },

  setReviewStatus: async (id, status) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request(`/admin/reviews/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    }
    await mockDelay();

    const reviews = getStoredReviews();
    const updated = reviews.map((r) => (r.id === id ? { ...r, status } : r));
    saveStoredReviews(updated);
    return updated.find((r) => r.id === id);
  },

  deleteReview: async (id) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request(`/admin/reviews/${id}`, { method: "DELETE" });
    }
    await mockDelay();

    const reviews = getStoredReviews();
    saveStoredReviews(reviews.filter((r) => r.id !== id));
    return { success: true };
  },
};

// ---------------------------------------------------------------------------
// Contact API - customer queries + admin moderation.
// ---------------------------------------------------------------------------
export const contactAPI = {
  sendMessage: async ({ name, email, phone, subject, message }) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
    }

    await mockDelay();

    const messages = getStoredMessages();
    const newMessage = {
      id: crypto.randomUUID(),
      name,
      email,
      phone: phone?.trim() || "",
      subject: subject?.trim() || "General Query",
      message: message.trim(),
      status: MESSAGE_STATUS.NEW,
      createdAt: new Date().toISOString(),
    };

    saveStoredMessages([newMessage, ...messages]);
    return newMessage;
  },

  getMessages: async () => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/admin/messages");
    }
    await mockDelay();
    return getStoredMessages().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  resolveMessage: async (id, status) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request(`/admin/messages/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    }
    await mockDelay();
    const messages = getStoredMessages();
    const updated = messages.map((m) => (m.id === id ? { ...m, status } : m));
    saveStoredMessages(updated);
    return updated.find((m) => m.id === id);
  },

  deleteMessage: async (id) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request(`/admin/messages/${id}`, { method: "DELETE" });
    }
    await mockDelay();
    const messages = getStoredMessages().filter((m) => m.id !== id);
    saveStoredMessages(messages);
    return { success: true };
  },
};

// ---------------------------------------------------------------------------
// Admin dashboard aggregates - computed client-side from the same mock
// stores. A real backend would do this aggregation in the database
// (e.g. Mongo aggregation pipeline) rather than in JS over the full dataset.
// ---------------------------------------------------------------------------
export const adminAPI = {
  getStats: async () => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/admin/stats");
    }
    await mockDelay();

    const orders = getAllStoredOrders();
    const meals = getStoredMeals();
    const users = getStoredUsers().filter((u) => u.role !== USER_ROLES.ADMIN);

    const revenue = orders
      .filter((o) => o.status !== ORDER_STATUS.CANCELLED)
      .reduce((sum, o) => sum + o.pricing.total, 0);

    const statusCounts = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    const today = new Date();
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(today);
      day.setDate(today.getDate() - (6 - i));
      const dayKey = day.toDateString();

      const dayRevenue = orders
        .filter(
          (o) =>
            o.status !== ORDER_STATUS.CANCELLED &&
            new Date(o.createdAt).toDateString() === dayKey
        )
        .reduce((sum, o) => sum + o.pricing.total, 0);

      return { label: day.toLocaleDateString("en-IN", { weekday: "short" }), value: dayRevenue };
    });

    return {
      totalOrders: orders.length,
      totalRevenue: revenue,
      totalCustomers: users.length,
      totalMeals: meals.length,
      statusCounts,
      last7Days,
    };
  },

  getCustomers: async () => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request("/admin/customers");
    }
    await mockDelay();

    const orders = getAllStoredOrders();
    const users = getStoredUsers().filter((u) => u.role !== USER_ROLES.ADMIN);

    return users.map((u) => {
      const userOrders = orders.filter((o) => o.userId === u.id);
      const totalSpent = userOrders
        .filter((o) => o.status !== ORDER_STATUS.CANCELLED)
        .reduce((sum, o) => sum + o.pricing.total, 0);

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        createdAt: u.createdAt,
        orderCount: userOrders.length,
        totalSpent,
      };
    });
  },

  // Powers the "View Orders" drawer on Manage Customers - one customer's
  // full order history (every item, status, total), newest first.
  getCustomerOrders: async (customerId) => {
    if (!APP_CONFIG.USE_MOCK_API) {
      return request(`/admin/customers/${customerId}/orders`);
    }
    await mockDelay();

    const customerRecord = getStoredUsers().find((u) => u.id === customerId);
    if (!customerRecord) throw new Error("Customer not found");

    const orders = getAllStoredOrders()
      .filter((o) => o.userId === customerId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      customer: {
        id: customerRecord.id,
        name: customerRecord.name,
        email: customerRecord.email,
        phone: customerRecord.phone,
        createdAt: customerRecord.createdAt,
      },
      orders,
    };
  },
};

export default request;