import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    employeesList: null,
    terminatedList: null,
    employeeDashBoard: null,
};

const employeeSlice = createSlice({
    name: 'employee',
    initialState: initialState,
    reducers: {
        setEmployees(state, { payload }) {
            state.employeesList = payload;
        },
        setEmployeeDashbord(state, { payload }) {
            state.employeeDashBoard = payload;
        },
        setTerminateEmployees(state, { payload }) {
            state.terminatedList = payload;
        },
    },
});

export default employeeSlice.reducer;

export const { setEmployees, setTerminateEmployees, setEmployeeDashbord } = employeeSlice.actions;
