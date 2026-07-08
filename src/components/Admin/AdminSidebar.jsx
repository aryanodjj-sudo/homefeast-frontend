import { NavLink } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const NAV_ITEMS = [
  { to: ROUTES.ADMIN, label: "Dashboard", icon: "📊", end: true },
  { to: ROUTES.ADMIN_MEALS, label: "Meals", icon: "🍽️" },
  { to: ROUTES.ADMIN_CATEGORIES, label: "Categories", icon: "🏷️" },
  { to: ROUTES.ADMIN_ORDERS, label: "Orders", icon: "📦" },
  { to: ROUTES.ADMIN_CUSTOMERS, label: "Customers", icon: "👥" },
  { to: ROUTES.ADMIN_REVIEWS, label: "Reviews", icon: "⭐" },
  { to: ROUTES.ADMIN_MESSAGES, label: "Messages", icon: "✉️" },
];

const AdminSidebar = () => (
  <aside className="w-full shrink-0 border-b bg-white dark:border-gray-800 dark:bg-gray-900 md:w-60 md:border-b-0 md:border-r">
    <div className="px-6 py-5">
      <p className="text-lg font-bold text-orange-500">HomeFeast</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
    </div>

    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:pb-6">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-orange-500 text-white"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`
          }
        >
          <span>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default AdminSidebar;