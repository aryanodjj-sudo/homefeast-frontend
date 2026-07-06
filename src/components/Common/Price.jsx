import { formatPrice } from "../../utils/formatPrice";

const Price = ({ value }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-extrabold text-orange-500">
        {formatPrice(value)}
      </span>

      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
        Best Price
      </span>
    </div>
  );
};

export default Price;