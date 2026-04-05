import { get, set, del } from 'idb-keyval';

/**
 * Custom storage engine for redux-persist using IndexedDB via idb-keyval.
 * More performant and reliable than localStorage for offline-first apps.
 */
const idbStorage = {
  getItem: (key) => get(key),
  setItem: (key, value) => set(key, value),
  removeItem: (key) => del(key),
};

export default idbStorage;
