import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import fileReducer from "@/redux/slices/fileSlice";
import userReducer from "@/redux/slices/userSlice";
import reportSlice from "@/redux/slices/reportSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    file: fileReducer,
    user: userReducer,
    report: reportSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
