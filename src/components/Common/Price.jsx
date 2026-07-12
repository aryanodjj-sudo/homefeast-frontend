import { formatPrice } from "../../utils/formatPrice";

// originalValue is optional - when provided (and higher than value), shows
// the struck-through MRP + a "X% OFF" badge instead of the plain "Best Price" tag.
const Price = ({ value, originalValue }) => {
  const hasDiscount = originalValue && originalValue > value;
  const discountPercent = hasDiscount
    ? Math.round(((originalValue - value) / originalValue) * 100)
    : 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-2xl font-extrabold text-orange-500">
        {formatPrice(value)}
      </span>

      {hasDiscount && (
        <span className="text-sm font-medium text-gray-400 line-through">
          {formatPrice(originalValue)}
        </span>
      )}

      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
        {hasDiscount ? `${discountPercent}% OFF` : "Best Price"}
      </span>
    </div>
  );
};

export default Price;