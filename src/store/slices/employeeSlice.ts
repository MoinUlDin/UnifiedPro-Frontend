import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    employeesList: null,
};

const employeeSlice = createSlice({
    name: 'employee',
    initialState: initialState,
    reducers: {
        setEmployees(state, { payload }) {
            state.employeesList = payload;
        },
    },
});

export default employeeSlice.reducer;

export const { setEmployees } = employeeSlice.actions;
