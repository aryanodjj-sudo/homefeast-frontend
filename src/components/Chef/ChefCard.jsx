import Rating from "../Common/Rating";

const ChefCard = ({ chef }) => {
  return (
    <div className="w-full max-w-sm rounded-3xl border border-ink/10 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-gray-900">
      <img
        src={chef.image}
        alt={chef.name}
        className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-turmeric/20"
      />

      <h3 className="mt-4 font-display text-xl font-semibold">{chef.name}</h3>

      <p className="mt-1 text-sm font-medium text-curry">{chef.speciality}</p>

      <div className="mt-4 flex justify-center border-t border-ink/10 pt-4 dark:border-gray-700">
        <Rating value={chef.rating} />
      </div>
    </div>
  );
};

export default ChefCard;