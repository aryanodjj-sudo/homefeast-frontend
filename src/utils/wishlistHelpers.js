// Small, pure helper for wishlist-related components.
// Mirrors cartHelpers' isCartEmpty for a consistent empty-state check pattern.
export const isWishlistEmpty = (wishlist = []) => wishlist.length === 0;