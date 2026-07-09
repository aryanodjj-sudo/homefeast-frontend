// Central place for environment-driven configuration.
// Flipping USE_MOCK_API to false (once the real backend from Step 11 is deployed)
// switches every call in utils/api.js from localStorage-based mocks to real HTTP
// requests, without any page or component needing to change.

export const APP_CONFIG = {
  APP_NAME: "HomeFeast",
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API !== "false",
  MOCK_NETWORK_DELAY_MS: 600,
  CURRENCY_SYMBOL: "₹",
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
};

export default APP_CONFIG;