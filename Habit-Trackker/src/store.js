import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import idbStorage from "./utils/idbStorage";
import habitsReducer from "./slices/habitsSlice";
import logsReducer from "./slices/logsSlice";

const rootReducer = combineReducers({
  habits: habitsReducer,
  logs: logsReducer,
});

const persistConfig = {
  key: "root",
  storage: idbStorage,
  whitelist: ["habits", "logs"], // Only persist habits and logs
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

export const persistor = persistStore(store);
