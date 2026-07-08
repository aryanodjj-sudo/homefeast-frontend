import { useEffect, useState } from "react";
import { contactAPI } from "../../utils/api";
import { formatDate } from "../../utils/formatDate";
import { MESSAGE_STATUS } from "../../utils/constants";
import Loader from "../../components/Common/Loader";
import Alert from "../../components/Common/Alert";

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await contactAPI.getMessages();
      setMessages(data);
    } catch (err) {
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMessages();
  }, []);

  const toggleStatus = async (msg) => {
    setBusyId(msg.id);
    try {
      const nextStatus =
        msg.status === MESSAGE_STATUS.NEW ? MESSAGE_STATUS.RESOLVED : MESSAGE_STATUS.NEW;
      const updated = await contactAPI.resolveMessage(msg.id, nextStatus);
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? updated : m)));
    } catch (err) {
      setError(err.message || "Could not update message");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    setBusyId(id);
    try {
      await contactAPI.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err.message || "Could not delete message");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Contact Messages</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {messages.length} message{messages.length !== 1 ? "s" : ""} from customers.
      </p>

      {error && (
        <div className="mt-4">
          <Alert type="error" message={error} />
        </div>
      )}

      <div className="mt-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="rounded-2xl border bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{msg.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {msg.email}
                  {msg.phone ? ` · ${msg.phone}` : ""} · {formatDate(msg.createdAt)}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  msg.status === MESSAGE_STATUS.NEW
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400"
                    : "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                }`}
              >
                {msg.status}
              </span>
            </div>

            {msg.subject && (
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Subject: {msg.subject}
              </p>
            )}

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{msg.message}</p>

            <div className="mt-4 flex gap-4 text-sm">
              <button
                type="button"
                onClick={() => toggleStatus(msg)}
                disabled={busyId === msg.id}
                className="font-medium text-orange-500 hover:underline disabled:opacity-60"
              >
                {msg.status === MESSAGE_STATUS.NEW ? "Mark Resolved" : "Mark New"}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(msg.id)}
                disabled={busyId === msg.id}
                className="font-medium text-red-500 hover:underline disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">No messages yet.</p>
        )}
      </div>
    </div>
  );
};

export default ManageMessages;