import { createSlice } from "@reduxjs/toolkit";

// Try to get initial user from localStorage
const getSavedUser = () => {
  try {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Error loading user from localStorage:", error);
    return null;
  }
};

const initialState = {
  currentUser: getSavedUser(),
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      // Sync to localStorage when user is set
      if (action.payload) {
        localStorage.setItem('currentUser', JSON.stringify(action.payload));
      }
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      // Clear from localStorage when user is cleared
      localStorage.removeItem('currentUser');
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = accountSlice.actions;
export default accountSlice.reducer; 