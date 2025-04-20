import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("currentUser");

const initialState = {
  currentUser: storedUser ? JSON.parse(storedUser) : null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      localStorage.removeItem("currentUser");
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = accountSlice.actions;
export default accountSlice.reducer;
