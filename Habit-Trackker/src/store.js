import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "./slices/habitsSlice";
import logsReducer from "./slices/logsSlice";

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    logs: logsReducer,
  },
});
