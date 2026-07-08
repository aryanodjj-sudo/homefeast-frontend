import { Link } from "react-router-dom";

const NavLinks = ({ mobile = false }) => {
  return (
    <div
      className={
        mobile
          ? "flex flex-col gap-4 font-medium"
          : "flex gap-6 font-medium"
      }
    >
      <Link
        to="/"
        className="text-gray-700 transition hover:text-orange-500 dark:text-gray-200"
      >
        Home
      </Link>
      <Link
        to="/menu"
        className="text-gray-700 transition hover:text-orange-500 dark:text-gray-200"
      >
        Menu
      </Link>
      <Link
        to="/chefs"
        className="text-gray-700 transition hover:text-orange-500 dark:text-gray-200"
      >
        Chefs
      </Link>
      <Link
        to="/cart"
        className="text-gray-700 transition hover:text-orange-500 dark:text-gray-200"
      >
        Cart
      </Link>
      <Link
        to="/wishlist"
        className="text-gray-700 transition hover:text-orange-500 dark:text-gray-200"
      >
        Wishlist
      </Link>
    </div>
  );
};

export default NavLinks;