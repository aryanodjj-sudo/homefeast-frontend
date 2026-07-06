// Small, pure helpers shared by cart-related components.
// CartContext already tracks totalItems/totalPrice for the whole cart;
// these cover the per-item math so it isn't duplicated in every component.
export const getItemSubtotal = (item) => item.price * item.quantity;

export const isCartEmpty = (cart = []) => cart.length === 0;