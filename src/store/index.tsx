import { configureStore } from '@reduxjs/toolkit';
import themeConfigReducer from './themeConfigSlice'; // Adjust this path as needed
import settingsReduce from './slices/settingSlice';
const store = configureStore({
    reducer: {
        themeConfig: themeConfigReducer,
        settings: settingsReduce,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
