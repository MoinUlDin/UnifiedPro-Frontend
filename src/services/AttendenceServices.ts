import api from '../utils/api';

export default class AttendenceServices {
    static async FetchAttendence() {
        try {
            const response = await api.get('/routine-tasks/attendace/');
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async FetchAttendenceOverview() {
        try {
            const response = await api.get('/routine-tasks/attendace/attendence_overview/');
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response?.data?.detail || 'Error Fetching Attendence OverView';
            throw new Error(msg);
        }
    }
}
