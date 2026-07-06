import useToast from "../../hooks/useToast";

const ICONS = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

const STYLES = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-gray-800",
};

// Mounted once near the root (see App.jsx) so toasts survive page navigation -
// firing toast.success() right before a redirect (e.g. placing an order)
// still shows the toast on the page you land on.
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast-in flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${STYLES[t.type]}`}
        >
          <span className="mt-0.5">{ICONS[t.type]}</span>
          <p className="flex-1">{t.message}</p>
          <button
            type="button"
            onClick={() => removeToast(t.id)}
            className="text-white/80 hover:text-white"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;