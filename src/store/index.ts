import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./account-reducer.ts";

export interface StoreType {
  accountReducer: {
    currentUser: any;
  };
}

const store = configureStore({
  reducer: {
    accountReducer,
  },
});

export default store; 