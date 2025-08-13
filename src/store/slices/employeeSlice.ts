import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    employeesList: null,
    terminatedList: null,
};

const employeeSlice = createSlice({
    name: 'employee',
    initialState: initialState,
    reducers: {
        setEmployees(state, { payload }) {
            state.employeesList = payload;
        },
        setTerminateEmployees(state, { payload }) {
            state.terminatedList = payload;
        },
    },
});

export default employeeSlice.reducer;

export const { setEmployees, setTerminateEmployees } = employeeSlice.actions;
