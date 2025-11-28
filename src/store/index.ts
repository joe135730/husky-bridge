import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./account-reducer.ts";

export interface StoreType {
  accountReducer: {
    currentUser: {
      _id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      role?: string;
      [key: string]: unknown;
    } | null;
  };
}

const store = configureStore({
  reducer: {
    accountReducer,
  },
});

export default store; 