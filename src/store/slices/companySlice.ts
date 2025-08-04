import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    announcements: null,
};

const companySlice = createSlice({
    name: 'employee',
    initialState: initialState,
    reducers: {
        setAnnouncements(state, { payload }) {
            state.announcements = payload;
        },
    },
});

export default companySlice.reducer;

export const { setAnnouncements } = companySlice.actions;
