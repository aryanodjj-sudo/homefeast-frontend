import { useEffect, useMemo, useState } from "react";
import { adminAPI } from "../../utils/api";
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";
import Loader from "../../components/Common/Loader";
import Alert from "../../components/Common/Alert";
import CustomerOrdersDrawer from "../../components/Admin/CustomerOrdersDrawer";

const AVATAR_COLORS = [
  "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400",
];

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const getAvatarColor = (name = "") => {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index] || AVATAR_COLORS[0];
};

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("totalSpent"); // "totalSpent" | "orderCount" | "name" | "createdAt"
  const [sortDir, setSortDir] = useState("desc"); // "asc" | "desc"
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminAPI.getCustomers();
        setCustomers(data);
      } catch (err) {
        setError(err.message || "Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  };

  const summary = useMemo(() => {
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalOrders = customers.reduce((sum, c) => sum + c.orderCount, 0);
    const avgSpend = customers.length ? totalRevenue / customers.length : 0;

    return { totalRevenue, totalOrders, avgSpend };
  }, [customers]);

  const visibleCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = query
      ? customers.filter(
          (c) =>
            c.name.toLowerCase().includes(query) ||
            c.email.toLowerCase().includes(query) ||
            (c.phone || "").includes(query)
        )
      : customers;

    const sorted = [...filtered].sort((a, b) => {
      let diff = 0;
      if (sortBy === "name") diff = a.name.localeCompare(b.name);
      else if (sortBy === "createdAt") diff = new Date(a.createdAt) - new Date(b.createdAt);
      else diff = a[sortBy] - b[sortBy];

      return sortDir === "asc" ? diff : -diff;
    });

    return sorted;
  }, [customers, search, sortBy, sortDir]);

  const SortHeader = ({ field, children, align = "left" }) => (
    <th className={`px-4 py-3 ${align === "right" ? "text-right" : "text-left"}`}>
      <button
        type="button"
        onClick={() => toggleSort(field)}
        className={`inline-flex items-center gap-1 font-medium hover:text-gray-900 dark:hover:text-white ${
          sortBy === field ? "text-gray-900 dark:text-white" : ""
        }`}
      >
        {children}
        {sortBy === field && <span className="text-xs">{sortDir === "asc" ? "▲" : "▼"}</span>}
      </button>
    </th>
  );

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Customers</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {customers.length} registered customer{customers.length !== 1 ? "s" : ""}
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or phone..."
          className="w-full max-w-xs rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-900"
        />
      </div>

      {error && (
        <div className="mt-4">
          <Alert type="error" message={error} />
        </div>
      )}

      {/* Summary cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Customers</p>
          <p className="mt-1 text-2xl font-bold">{customers.length}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders Placed</p>
          <p className="mt-1 text-2xl font-bold">{summary.totalOrders}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Spend / Customer</p>
          <p className="mt-1 text-2xl font-bold text-orange-500">
            {formatPrice(summary.avgSpend)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-2xl border bg-white dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
            <tr>
              <SortHeader field="name">Customer</SortHeader>
              <th className="px-4 py-3">Contact</th>
              <SortHeader field="createdAt">Joined</SortHeader>
              <SortHeader field="orderCount">Orders</SortHeader>
              <SortHeader field="totalSpent">Total Spent</SortHeader>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleCustomers.map((customer) => (
              <tr key={customer.id} className="border-b last:border-0 dark:border-gray-800">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(
                        customer.name
                      )}`}
                    >
                      {getInitials(customer.name) || "?"}
                    </span>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  <p>{customer.email}</p>
                  <p className="text-xs">{customer.phone || "—"}</p>
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {formatDate(customer.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {customer.orderCount} order{customer.orderCount !== 1 ? "s" : ""}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold">{formatPrice(customer.totalSpent)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => setSelectedCustomerId(customer.id)}
                    disabled={customer.orderCount === 0}
                    className="rounded-lg border border-orange-500 px-3 py-1.5 text-xs font-semibold text-orange-500 hover:bg-orange-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 dark:hover:bg-orange-500/10"
                  >
                    View Orders
                  </button>
                </td>
              </tr>
            ))}

            {visibleCustomers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">
                  {search ? "No customers match your search." : "No customers have registered yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedCustomerId && (
        <CustomerOrdersDrawer
          customerId={selectedCustomerId}
          onClose={() => setSelectedCustomerId(null)}
        />
      )}
    </div>
  );
};

export default ManageCustomers;