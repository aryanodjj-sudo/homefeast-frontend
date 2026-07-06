import { useEffect } from "react";

// Generic modal shell. Closes on Escape and on backdrop click, and scrolls
// its own content if it's taller than the viewport (forms with lots of
// fields, like MealForm, would otherwise overflow off-screen).
const Modal = ({ children, close, title }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [close]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 dark:bg-gray-900"
      >
        <div className="flex items-center justify-between">
          {title && <h2 className="text-lg font-bold">{title}</h2>}
          <button
            type="button"
            onClick={close}
            className="ml-auto text-xl leading-none text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;