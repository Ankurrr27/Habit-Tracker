import { createSlice } from "@reduxjs/toolkit";

const habitsSlice = createSlice({
  name: "habits",
  initialState: {
    list: [],
  },
  reducers: {
    setHabits(state, action) {
      state.list = action.payload;
    },
    addHabit(state, action) {
      state.list.push(action.payload);
    },
  },
});

export const { setHabits, addHabit } = habitsSlice.actions;
export default habitsSlice.reducer;
