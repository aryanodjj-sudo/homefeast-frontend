import { RouterProvider } from "react-router-dom";
import router from "./routes/router";

import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { OrderProvider } from "./context/OrderContext";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import ToastContainer from "./components/Common/ToastContainer";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        {/* ToastProvider wraps everything below RouterProvider too, and
            ToastContainer is rendered once here (outside <Outlet>) so a
            toast fired right before a redirect survives the navigation. */}
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                {/* OrderProvider sits inside AuthProvider - orders are scoped per user */}
                <OrderProvider>
                  <RouterProvider router={router} />
                  <ToastContainer />
                </OrderProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;