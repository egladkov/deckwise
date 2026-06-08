export const storageService = {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error getting item from localStorage with key "${key}":`, error);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item to localStorage with key "${key}":`, error);
    }
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage with key "${key}":`, error);
    }
  },

  clearAppData(): void {
    if (typeof window === "undefined") return;
    try {
      // Clear only keys that belong to deckwise
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("deckwise.")) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Error clearing app data from localStorage:", error);
    }
  },
};
