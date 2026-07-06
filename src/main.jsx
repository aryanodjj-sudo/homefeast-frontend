import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { seedAdminUser } from "./utils/storageManager";

import "./index.css";

// One-time setup so /admin is reachable immediately (see SEED_ADMIN in
// utils/constants.js) without a separate "promote to admin" flow, which
// doesn't exist until there's a real backend to issue roles from.
seedAdminUser();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);