import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import logger from "../../common/pino";
import { getTokenFromCookie, removeTokenCookie, setTokenCookie } from "../../common/cookie";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: getTokenFromCookie() || null,
  isAuthenticated: Boolean(getTokenFromCookie()),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      logger.info("Dispatching login action with payload:", action.payload);
      state.token = action.payload;
      state.isAuthenticated = true;
      setTokenCookie(action.payload);
    },
    logout: (state) => {
      logger.info("Dispatching login action with state:", state);
      state.token = null;
      state.isAuthenticated = false;
      removeTokenCookie();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
