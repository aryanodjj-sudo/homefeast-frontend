// Formats a numeric price as an Indian Rupee string, e.g. formatPrice(250) -> "₹250".
// Centralizing this avoids every component hand-rolling its own `₹${value}` string,
// and keeps the format consistent (and easy to change, e.g. to add decimals) in one place.
export const formatPrice = (value) => {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default formatPrice;