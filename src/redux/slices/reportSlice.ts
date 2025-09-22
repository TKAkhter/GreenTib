import logger from "@/common/pino";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReportState {
    category: string | null;
    answers: Record<string, string>;
    notes: string[];
}

const initialState: ReportState = {
    category: null,
    answers: {},
    notes: [],
};

const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {
        setReport: (
            state,
            action: PayloadAction<{ category: string; answers: Record<string, string> }>
        ) => {
            logger.info(`Dispatching setReport action with payload: ${JSON.stringify(action.payload)}`);
            state.category = action.payload.category;
            state.answers = action.payload.answers;
        },
        addNote: (state, action: PayloadAction<string>) => {
            logger.info(`Dispatching addNote action with payload: ${action.payload}`);
            state.notes.push(action.payload);
        },
        resetReport: () => initialState,
    },
});

export const { setReport, addNote, resetReport } = reportSlice.actions;
export default reportSlice.reducer;
