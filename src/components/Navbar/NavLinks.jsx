import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";

const NavLinks = ({ mobile = false }) => {
  const { totalItems } = useCart();

  return (
    <div
      className={
        mobile
          ? "flex flex-col gap-4 font-medium"
          : "flex items-center gap-6 font-medium"
      }
    >
      <Link to="/" className="text-gray-700 transition hover:text-orange-500 dark:text-gray-200">
        Home
      </Link>
      <Link to="/menu" className="text-gray-700 transition hover:text-orange-500 dark:text-gray-200">
        Menu
      </Link>
      <Link to="/chefs" className="text-gray-700 transition hover:text-orange-500 dark:text-gray-200">
        Chefs
      </Link>
      <Link to="/about" className="text-gray-700 transition hover:text-orange-500 dark:text-gray-200">
        About
      </Link>
      <Link to="/contact" className="text-gray-700 transition hover:text-orange-500 dark:text-gray-200">
        Contact
      </Link>
      <Link to="/wishlist" className="text-gray-700 transition hover:text-orange-500 dark:text-gray-200">
        Wishlist
      </Link>

      <Link
        to="/cart"
        className="relative flex items-center text-gray-700 transition hover:text-orange-500 dark:text-gray-200"
        aria-label="Cart"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l3.6-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m-10 0a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"
          />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
        {mobile && <span className="ml-2">Cart</span>}
      </Link>
    </div>
  );
};

export default NavLinks;