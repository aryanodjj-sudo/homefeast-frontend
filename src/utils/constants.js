// Application-wide constants.
// Centralizing these avoids magic strings and typos scattered across the codebase.

export const STORAGE_KEYS = {
  USER: "homefeast-user",
  TOKEN: "homefeast-token",
  USERS_DB: "homefeast-users-db",
  CART: "homefeast-cart",
  WISHLIST: "homefeast-wishlist",
  ORDERS: "homefeast-orders",
  THEME: "homefeast-theme",
  MEALS: "homefeast-meals",
  CATEGORIES: "homefeast-categories",
  REVIEWS: "homefeast-reviews",
};

export const USER_ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
};

// Seed admin account, created automatically the first time the app runs
// (see utils/storageManager.js -> seedAdminUser). Lets you log in to /admin
// immediately without a separate "become an admin" flow, which doesn't
// exist yet since there's no real backend to issue roles from.
export const SEED_ADMIN = {
  email: "admin@homefeast.com",
  password: "admin123",
};

export const ROUTES = {
  HOME: "/",
  MENU: "/menu",
  CHEFS: "/chefs",
  ABOUT: "/about",
  CONTACT: "/contact",
  LOGIN: "/login",
  REGISTER: "/register",
  CART: "/cart",
  WISHLIST: "/wishlist",
  PROFILE: "/profile",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  mealDetails: (id = ":id") => `/meal/${id}`,
  orderDetails: (id = ":id") => `/orders/${id}`,
  orderSuccess: (id = ":id") => `/order-success/${id}`,

  // Admin panel
  ADMIN: "/admin",
  ADMIN_MEALS: "/admin/meals",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_CUSTOMERS: "/admin/customers",
  ADMIN_REVIEWS: "/admin/reviews",
};

export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters",
  PASSWORD_MISMATCH: "Passwords do not match",
  INVALID_NAME: "Name must be at least 2 characters",
  INVALID_PHONE: "Please enter a valid 10-digit phone number",
  EMAIL_TAKEN: "An account with this email already exists",
  INVALID_CREDENTIALS: "Invalid email or password",
  INVALID_PINCODE: "Please enter a valid 6-digit pincode",
};

export const APP_NAME = "HomeFeast";

// ---------------------------------------------------------------------------
// Checkout / Orders
// ---------------------------------------------------------------------------

// Order lifecycle. Kept as a flat, ordered list (rather than an enum-like
// object) as well so OrderTracking-style UI can map over it to draw a
// progress stepper without hardcoding order in multiple places.
export const ORDER_STATUS_FLOW = [
  "Placed",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

export const ORDER_STATUS = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

// Statuses a customer is still allowed to cancel from.
export const CANCELLABLE_STATUSES = [
  ORDER_STATUS.PLACED,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PREPARING,
];

export const PAYMENT_METHODS = {
  COD: "cod",
  CARD: "card",
  UPI: "upi",
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.COD]: "Cash on Delivery",
  [PAYMENT_METHODS.CARD]: "Credit / Debit Card",
  [PAYMENT_METHODS.UPI]: "UPI",
};

export const CHECKOUT_CONFIG = {
  FREE_SHIPPING_THRESHOLD: 500,
  SHIPPING_FEE: 40,
  TAX_RATE: 0.05, // 5% GST, shown as a separate line item
};

// Mock coupon catalog. In Phase 4/5 this becomes a real /coupons/validate
// endpoint - validateCoupon() in orderHelpers.js is written so only its
// internals need to change, not any component that calls it.
export const COUPONS = {
  WELCOME50: { code: "WELCOME50", type: "flat", value: 50, minOrder: 200 },
  SAVE10: { code: "SAVE10", type: "percent", value: 10, maxDiscount: 100, minOrder: 300 },
  FEAST20: { code: "FEAST20", type: "percent", value: 20, maxDiscount: 200, minOrder: 800 },
};

// ---------------------------------------------------------------------------
// Reviews (Phase 7 groundwork - admin moderation ships now, the
// customer-facing "Add a Review" form arrives with the rest of Phase 7)
// ---------------------------------------------------------------------------
export const REVIEW_STATUS = {
  PUBLISHED: "Published",
  HIDDEN: "Hidden",
};