import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Common/Loader";

// Wraps private routes (Cart, Wishlist, Profile, Checkout, Orders).
// Unauthenticated users are redirected to /login, and the page they wanted
// is remembered in location.state.from so Login can send them back after success.
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;