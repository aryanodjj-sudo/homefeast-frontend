import { useEffect, useState } from "react";
import { adminAPI } from "../../utils/api";
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";
import Loader from "../../components/Common/Loader";
import Alert from "../../components/Common/Alert";

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Customers</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {customers.length} registered customer{customers.length !== 1 ? "s" : ""}
      </p>

      {error && (
        <div className="mt-4">
          <Alert type="error" message={error} />
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border bg-white dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b last:border-0 dark:border-gray-800">
                <td className="px-4 py-3 font-medium">{customer.name}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{customer.email}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {customer.phone || "—"}
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {formatDate(customer.createdAt)}
                </td>
                <td className="px-4 py-3">{customer.orderCount}</td>
                <td className="px-4 py-3 font-medium">{formatPrice(customer.totalSpent)}</td>
              </tr>
            ))}

            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">
                  No customers have registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCustomers;