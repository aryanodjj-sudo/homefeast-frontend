import { ORDER_STATUS, ORDER_STATUS_FLOW } from "../../utils/constants";

// Horizontal progress stepper across the normal order lifecycle.
// If the order was cancelled, the flow bar is replaced with a single
// cancelled indicator instead of a partially-filled progress bar.
const OrderTracker = ({ status }) => {
  if (status === ORDER_STATUS.CANCELLED) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-center font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
        This order was cancelled
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(status);

  return (
    <div className="flex items-center">
      {ORDER_STATUS_FLOW.map((step, index) => {
        const isComplete = index <= currentIndex;
        const isLast = index === ORDER_STATUS_FLOW.length - 1;

        return (
          <div key={step} className="flex flex-1 flex-col items-center last:flex-none">
            <div className="flex w-full items-center">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                  isComplete ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                {index + 1}
              </div>
              {!isLast && (
                <div
                  className={`h-1 flex-1 ${
                    index < currentIndex ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-700"
                  }`}
                />
              )}
            </div>
            <span className="mt-2 text-center text-[11px] text-gray-500 dark:text-gray-400">
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTracker;