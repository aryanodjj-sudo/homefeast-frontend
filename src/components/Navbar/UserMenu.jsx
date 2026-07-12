import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import { ROUTES, USER_ROLES } from "../../utils/constants";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

// Avatar + name is the only thing visible on the navbar itself - Logout
// lives inside the dropdown (opened by clicking the avatar) instead of
// sitting next to the name at all times.
const UserMenu = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    toast.info("Logged out successfully");
    navigate(ROUTES.HOME);
  };

  if (!user) {
    return (
      <Link
        to="/login"
        className="rounded-xl bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full pr-1 hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-9 w-9 rounded-full border object-cover dark:border-gray-700"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600 dark:bg-orange-500/10">
            {getInitials(user.name) || "?"}
          </span>
        )}
        <span className="hidden font-medium text-gray-700 dark:text-gray-200 sm:inline">
          {user.name.split(" ")[0]}
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b px-4 py-3 dark:border-gray-800">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>

          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            My Profile
          </Link>

          <Link
            to={ROUTES.ORDERS}
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            My Orders
          </Link>

          {user.role === USER_ROLES.ADMIN && (
            <Link
              to={ROUTES.ADMIN}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10"
            >
              Admin Panel
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="block w-full border-t px-4 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:border-gray-800 dark:hover:bg-red-500/10"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;