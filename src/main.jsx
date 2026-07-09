import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import { seedAdminUser } from "./utils/storageManager";
import { APP_CONFIG } from "./utils/appConfig";

import "./index.css";

// One-time setup so /admin is reachable immediately (see SEED_ADMIN in
// utils/constants.js) without a separate "promote to admin" flow, which
// doesn't exist until there's a real backend to issue roles from.
seedAdminUser();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={APP_CONFIG.GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);