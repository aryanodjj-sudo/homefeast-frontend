const Rating = ({ value = 0 }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-yellow-500 text-lg">⭐</span>

      <span className="font-semibold text-gray-800">
        {Number(value).toFixed(1)}
      </span>

      <span className="text-sm text-gray-500">
        ({Math.floor(value * 100)})
      </span>
    </div>
  );
};

export default Rating;