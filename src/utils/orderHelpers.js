// Pure, framework-free helpers for order math and identifiers.
// Kept separate from CartContext/OrderContext so the numbers on Checkout,
// Order Details, and Invoice all come from one source of truth.
import { CANCELLABLE_STATUSES, CHECKOUT_CONFIG, COUPONS } from "./constants";
import { formatPrice } from "./formatPrice";

export const calculateSubtotal = (cart = []) =>
  cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

// Free shipping past the threshold, flat fee otherwise. Empty cart ships free
// too, but Checkout.jsx redirects away before pricing is ever shown for one.
export const calculateShipping = (subtotal) => {
  if (subtotal <= 0) return 0;
  return subtotal >= CHECKOUT_CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : CHECKOUT_CONFIG.SHIPPING_FEE;
};

// Tax is charged on (subtotal + shipping), which is standard for food
// delivery platforms, and rounded to the nearest rupee for a clean total.
export const calculateTax = (subtotal, shipping = 0) =>
  Math.round((subtotal + shipping) * CHECKOUT_CONFIG.TAX_RATE);

// Looks up a coupon code and checks it against the current subtotal.
// Returns { valid, message } on failure or { valid: true, coupon } on success
// so CouponInput can show one or the other without extra branching.
export const validateCoupon = (rawCode, subtotal) => {
  const code = rawCode?.trim().toUpperCase();

  if (!code) {
    return { valid: false, message: "Please enter a coupon code" };
  }

  const coupon = COUPONS[code];

  if (!coupon) {
    return { valid: false, message: "Invalid or expired coupon code" };
  }

  if (subtotal < coupon.minOrder) {
    return {
      valid: false,
      message: `Add items worth ${formatPrice(coupon.minOrder - subtotal)} more to use this coupon`,
    };
  }

  return { valid: true, coupon };
};

export const calculateDiscount = (coupon, subtotal) => {
  if (!coupon) return 0;

  if (coupon.type === "flat") {
    return Math.min(coupon.value, subtotal);
  }

  if (coupon.type === "percent") {
    const rawDiscount = Math.round(subtotal * (coupon.value / 100));
    return coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
  }

  return 0;
};

export const calculateOrderTotal = ({ subtotal, shipping, tax, discount }) =>
  Math.max(subtotal + shipping + tax - discount, 0);

// Runs the full pipeline in one call so Checkout and OrderContext never
// duplicate the subtotal -> shipping -> tax -> discount -> total sequence.
export const getOrderPricing = (cart, coupon = null) => {
  const subtotal = calculateSubtotal(cart);
  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal, shipping);
  const discount = calculateDiscount(coupon, subtotal);
  const total = calculateOrderTotal({ subtotal, shipping, tax, discount });

  return { subtotal, shipping, tax, discount, total };
};

// Human-friendly, sufficiently-unique order id for a mock backend.
// e.g. "HF-M3K2P1-482". Replaced by the real DB _id once Phase 4/5 lands.
export const generateOrderId = () =>
  `HF-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;

export const canCancelOrder = (status) => CANCELLABLE_STATUSES.includes(status);