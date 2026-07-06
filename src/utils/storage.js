// Generic, safe localStorage wrapper.
// Every read/write is wrapped in try/catch so a corrupted or missing value
// never crashes the app - callers always get a predictable fallback instead.

export const getStorageItem = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.error(`storage: failed to read "${key}"`, error);
    return fallback;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`storage: failed to write "${key}"`, error);
    return false;
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`storage: failed to remove "${key}"`, error);
    return false;
  }
};