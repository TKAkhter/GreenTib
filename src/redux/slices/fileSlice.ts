import { createSlice } from "@reduxjs/toolkit";
import logger from "../../common/pino";

interface FileState {
  isFileUploaded: boolean;
}

const initialState: FileState = {
  isFileUploaded: false,
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setFileUploaded: (state) => {
      logger.info("Dispatching setFileUploaded action with payload:", state);
      state.isFileUploaded = true;
    },
    resetFileUploaded: (state) => {
      logger.info("Dispatching resetFileUploaded action with payload:", state);
      state.isFileUploaded = false;
    },
  },
});

export const { setFileUploaded, resetFileUploaded } = fileSlice.actions;
export default fileSlice.reducer;
