import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducer/user.js";

export const store = configureStore({
  reducer: {
    user:userReducer,
  },
});