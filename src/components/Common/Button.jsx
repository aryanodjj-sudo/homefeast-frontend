const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-xl
        bg-orange-500
        px-5
        py-3
        text-white
        transition-colors
        hover:bg-orange-600
        disabled:cursor-not-allowed
        disabled:opacity-60
        disabled:hover:bg-orange-500
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;