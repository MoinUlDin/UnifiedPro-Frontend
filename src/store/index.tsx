import { configureStore } from '@reduxjs/toolkit';
import themeConfigReducer from './themeConfigSlice'; // Adjust this path as needed

const store = configureStore({
    reducer: {
        themeConfig: themeConfigReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
