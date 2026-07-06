const Input = ({
  type = "text",
  name,
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  autoComplete,
  className = "",
}) => {
  const inputId = id || name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`
          w-full
          rounded-xl
          border
          px-4
          py-3
          outline-none
          transition-colors
          focus:ring-2
          focus:ring-orange-500
          disabled:cursor-not-allowed
          disabled:opacity-60
          dark:bg-gray-900
          dark:text-white
          ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-700"}
          ${className}
        `}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;