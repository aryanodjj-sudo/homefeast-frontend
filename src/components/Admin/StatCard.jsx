const StatCard = ({ label, value, icon }) => (
  <div className="rounded-2xl border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <span className="text-xl">{icon}</span>
    </div>
    <p className="mt-2 text-2xl font-bold">{value}</p>
  </div>
);

export default StatCard;