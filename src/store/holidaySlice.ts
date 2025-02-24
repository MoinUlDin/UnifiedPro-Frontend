import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Holiday {
  date: string;
  remarks: string;
}

interface HolidayState {
  holidays: Holiday[];
}

const initialState: HolidayState = {
  holidays: [],
};

const holidaySlice = createSlice({
  name: "holiday",
  initialState,
  reducers: {
    addHoliday: (state, action: PayloadAction<Holiday>) => {
      state.holidays.push(action.payload);
    },
  },
});

export const { addHoliday } = holidaySlice.actions;

export default holidaySlice.reducer;
