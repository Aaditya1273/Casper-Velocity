type StoredValue = string | null;

const memoryStore = new Map<string, string>();

const hasLocalStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const getFromStore = (key: string): StoredValue => {
  if (hasLocalStorage()) {
    return window.localStorage.getItem(key);
  }
  return memoryStore.get(key) ?? null;
};

const setInStore = (key: string, value: string) => {
  if (hasLocalStorage()) {
    window.localStorage.setItem(key, value);
    return;
  }
  memoryStore.set(key, value);
};

const removeFromStore = (key: string) => {
  if (hasLocalStorage()) {
    window.localStorage.removeItem(key);
    return;
  }
  memoryStore.delete(key);
};

const clearStore = () => {
  if (hasLocalStorage()) {
    window.localStorage.clear();
    return;
  }
  memoryStore.clear();
};

const AsyncStorage = {
  getItem: async (key: string): Promise<StoredValue> => getFromStore(key),
  setItem: async (key: string, value: string): Promise<void> => {
    setInStore(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    removeFromStore(key);
  },
  multiGet: async (keys: string[]): Promise<[string, StoredValue][]> =>
    keys.map((key) => [key, getFromStore(key)]),
  multiSet: async (entries: [string, string][]): Promise<void> => {
    entries.forEach(([key, value]) => setInStore(key, value));
  },
  multiRemove: async (keys: string[]): Promise<void> => {
    keys.forEach((key) => removeFromStore(key));
  },
  clear: async (): Promise<void> => {
    clearStore();
  },
};

export default AsyncStorage;
export { AsyncStorage };
