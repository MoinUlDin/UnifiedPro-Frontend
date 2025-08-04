import { configureStore } from '@reduxjs/toolkit';
import themeConfigReducer from './themeConfigSlice'; // Adjust this path as needed
import settingsReducer from './slices/settingSlice';
import employeeReducer from './slices/employeeSlice';
import companyReducer from './slices/companySlice';

const store = configureStore({
    reducer: {
        themeConfig: themeConfigReducer,
        settings: settingsReducer,
        employee: employeeReducer,
        company: companyReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
