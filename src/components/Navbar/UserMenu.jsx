import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import { ROUTES, USER_ROLES } from "../../utils/constants";

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          {user.role === USER_ROLES.ADMIN && (
            <Link
              to={ROUTES.ADMIN}
              className="rounded-xl border border-orange-500 px-4 py-2 font-medium text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10"
            >
              Admin
            </Link>
          )}

          <Link
            to="/profile"
            className="font-medium text-gray-700 hover:text-orange-500 dark:text-gray-200"
          >
            Hi, {user.name.split(" ")[0]}
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          to="/login"
          className="rounded-xl bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
        >
          Login
        </Link>
      )}
    </div>
  );
};

export default UserMenu;