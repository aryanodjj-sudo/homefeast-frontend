import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import Home from "../pages/Home";
import Menu from "../pages/Menu";
import Chefs from "../pages/Chefs";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import Profile from "../pages/Profile";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";
import OrderSuccess from "../pages/OrderSuccess";
import MealDetails from "../pages/MealDetails";
import NotFound from "../pages/NotFound";

import AdminDashboard from "../pages/admin/Dashboard";
import ManageMeals from "../pages/admin/ManageMeals";
import ManageCategories from "../pages/admin/ManageCategories";
import ManageOrders from "../pages/admin/ManageOrders";
import ManageCustomers from "../pages/admin/ManageCustomers";
import ManageReviews from "../pages/admin/ManageReviews";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/menu", element: <Menu /> },
      { path: "/chefs", element: <Chefs /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },

      {
        // Private routes: only reachable when authenticated.
        // ProtectedRoute redirects to /login (and remembers the intended
        // destination in location.state.from) when there is no logged-in user.
        element: <ProtectedRoute />,
        children: [
          { path: "/cart", element: <Cart /> },
          { path: "/wishlist", element: <Wishlist /> },
          { path: "/profile", element: <Profile /> },
          { path: "/checkout", element: <Checkout /> },
          { path: "/orders", element: <Orders /> },
          { path: "/orders/:id", element: <OrderDetails /> },
          { path: "/order-success/:id", element: <OrderSuccess /> },
        ],
      },

      { path: "/meal/:id", element: <MealDetails /> },
      { path: "*", element: <NotFound /> },
    ],
  },

  {
    // Admin panel: its own shell (AdminLayout), gated by role - not just
    // login. See AdminRoute for the customer-vs-admin redirect logic.
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "meals", element: <ManageMeals /> },
          { path: "categories", element: <ManageCategories /> },
          { path: "orders", element: <ManageOrders /> },
          { path: "customers", element: <ManageCustomers /> },
          { path: "reviews", element: <ManageReviews /> },
        ],
      },
    ],
  },
]);

export default router;