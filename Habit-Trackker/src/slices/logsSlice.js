import { createSlice } from "@reduxjs/toolkit";

const logsSlice = createSlice({
  name: "logs",
  initialState: {
    weekly: {}, // { habitId_dayKey: true }
  },
  reducers: {
    toggleLog(state, action) {
      const { key } = action.payload;
      state.weekly[key] = !state.weekly[key];
    },
  },
});

export const { toggleLog } = logsSlice.actions;
export default logsSlice.reducer;
