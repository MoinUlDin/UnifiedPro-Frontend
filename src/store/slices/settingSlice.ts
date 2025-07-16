import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    performanceMonitoringList: null,
    companyGoalsList: null,
    departmentGoalsList: null,
    sessionalGoalsList: null,
    keyResultsList: null,
    KPIList: null,
};

const settingSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setPM(state, { payload }) {
            state.performanceMonitoringList = payload;
        },
        setCG(state, { payload }) {
            state.companyGoalsList = payload;
        },
        setDG(state, { payload }) {
            state.departmentGoalsList = payload;
        },
        setSG(state, { payload }) {
            state.sessionalGoalsList = payload;
        },
        setKR(state, { payload }) {
            state.keyResultsList = payload;
        },
        setKPI(state, { payload }) {
            state.KPIList = payload;
        },
    },
});

export const { setPM, setCG, setDG, setSG, setKR, setKPI } = settingSlice.actions;
export default settingSlice.reducer;
