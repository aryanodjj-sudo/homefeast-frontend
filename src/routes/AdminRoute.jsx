import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Common/Loader";
import { ROUTES, USER_ROLES } from "../utils/constants";

// Wraps every /admin/* route. Unlike ProtectedRoute, this also checks role -
// a logged-in customer is bounced to the home page rather than /login, since
// they ARE authenticated, they just don't have admin access.
const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (user?.role !== USER_ROLES.ADMIN) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;