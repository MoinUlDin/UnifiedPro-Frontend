import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    announcements: null,
    allStructures: null,
};

const companySlice = createSlice({
    name: 'employee',
    initialState: initialState,
    reducers: {
        setAnnouncements(state, { payload }) {
            state.announcements = payload;
        },
        setAllStructures(state, { payload }) {
            state.allStructures = payload;
        },
    },
});

export default companySlice.reducer;

export const { setAnnouncements, setAllStructures } = companySlice.actions;
