import { useEffect, useState } from "react";
import { adminAPI } from "../../utils/api";
import { formatPrice } from "../../utils/formatPrice";
import Loader from "../../components/Common/Loader";
import Alert from "../../components/Common/Alert";
import StatCard from "../../components/Admin/StatCard";
import RevenueBarChart from "../../components/Admin/RevenueBarChart";
import OrderStatusBadge from "../../components/Orders/OrderStatusBadge";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminAPI.getStats();
        setStats(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        A quick snapshot of how HomeFeast is doing.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Orders" value={stats.totalOrders} icon="📦" />
        <StatCard label="Total Revenue" value={formatPrice(stats.totalRevenue)} icon="💰" />
        <StatCard label="Customers" value={stats.totalCustomers} icon="👥" />
        <StatCard label="Meals Listed" value={stats.totalMeals} icon="🍽️" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <h2 className="font-semibold">Revenue — Last 7 Days</h2>
          <div className="mt-4">
            <RevenueBarChart data={stats.last7Days} />
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="font-semibold">Orders by Status</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(stats.statusCounts).length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">No orders yet.</p>
            )}
            {Object.entries(stats.statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <OrderStatusBadge status={status} />
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;