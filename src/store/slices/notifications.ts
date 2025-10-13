import { createSlice } from '@reduxjs/toolkit';
import { type notificationsType, notificationsObjectType } from '../../constantTypes/CommonTypes';
const initailState = {
    notifications: { unread_count: 1, results: [] },
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: initailState,
    reducers: {
        setnotifications(state, { payload }) {
            state.notifications = payload;
        },
    },
});
export const { setnotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
