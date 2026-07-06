import { Link, Outlet } from "react-router-dom";
import AdminSidebar from "../components/Admin/AdminSidebar";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";

// Separate shell from MainLayout - no public Navbar/Footer inside the admin
// area, just a sidebar and a slim top bar with a way back to the storefront.
const AdminLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950 md:flex-row">
      <AdminSidebar />

      <div className="flex-1">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
          <Link to={ROUTES.HOME} className="text-sm text-gray-500 hover:text-orange-500">
            ← Back to Storefront
          </Link>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {user?.name}
          </span>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;