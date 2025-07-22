import api from '../utils/api';

export default class TaskServices {
    static async FetchTasks() {
        try {
            const response = await api.get(`/routine-tasks/task/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async AddTask(payload: any) {
        try {
            const response = await api.post(`/routine-tasks/task/`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (e: any) {
            console.log('Add Gaol error: ', e);
            const msg = e.response.data.weight || 'Error Creating Task';
            throw new Error(msg);
        }
    }
    static async UpdateTask(id: number, payload: any) {
        try {
            const response = await api.patch(`/routine-tasks/task/${id}/`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.weight || 'Error Updating Task';
            throw new Error(msg);
        }
    }
    static async DeleteTask(id: number) {
        try {
            const response = await api.delete(`/routine-tasks/task/${id}/`);
            return response.data;
        } catch (e: any) {
            console.log('Delete Goal Error:', e);
            const msg = 'Error Deleting Task';
            throw new Error(msg);
        }
    }
}
