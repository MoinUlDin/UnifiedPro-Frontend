import api from '../utils/api';
import { setnotifications } from '../store/slices/notifications';

export default class NotificationServices {
    static async FetchNotifications(dispatch: any) {
        try {
            const response = await api.get(`/routine-tasks/notifications/`);
            dispatch(setnotifications(response.data));
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async MarkAllRead() {
        try {
            const response = await api.post(`/routine-tasks/notifications/mark-read-all/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
