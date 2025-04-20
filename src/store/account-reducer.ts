import { createSlice } from "@reduxjs/toolkit";
import { saveUserToLocalStorage, getUserFromLocalStorage } from "../utils/auth";

const initialState = {
  currentUser: getUserFromLocalStorage() || null, // Initialize from localStorage if available
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      // Sync with localStorage
      saveUserToLocalStorage(action.payload);
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      // Clear from localStorage as well
      saveUserToLocalStorage(null);
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = accountSlice.actions;
export default accountSlice.reducer; 