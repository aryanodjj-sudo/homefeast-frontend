// Formats an ISO date string for display across Orders/Order Details.
// Returns "" for missing/invalid input rather than throwing, so a bad or
// absent timestamp never crashes a page - callers can render it as-is.
export const formatDate = (isoString, options) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  });
};

// Same as formatDate but also includes the time - used on Order Details
// where the exact placement time matters more than on the summary list.
export const formatDateTime = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default formatDate;