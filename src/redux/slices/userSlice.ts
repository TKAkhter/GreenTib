import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserFromCookie, removeUserCookie, setUserCookie } from "../../common/cookie";
import logger from "../../common/pino";
import { Users } from "@/generated";

const initialState: Users = getUserFromCookie() || {
  email: "",
  id: "",
  username: "",
  name: "",
  phoneNumber: "",
  bio: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    save: (state, action: PayloadAction<Users>) => {
      logger.info("Dispatching save action with payload:", action.payload);
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.phoneNumber = action.payload.phoneNumber;
      state.bio = action.payload.bio;
      setUserCookie(action.payload);
    },
    remove: (state) => {
      logger.info("Dispatching remove action with state:", state);
      state.email = "";
      state.id = "";
      state.name = "";
      state.phoneNumber = "";
      state.bio = "";
      removeUserCookie();
    },
  },
});

export const { save, remove } = userSlice.actions;
export default userSlice.reducer;
