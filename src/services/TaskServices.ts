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
    static async AssignTasks(payload: any) {
        try {
            const response = await api.post(`/routine-tasks/task/assign-tasks/`, payload);
            return response.data;
        } catch (e: any) {
            console.log('Add Gaol error: ', e);
            const msg = e.response.data?.co_workers[0] || e.response.data?.tasks[0] || 'Error Assigning Task';
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
    static async UpdateTaskProgress(id: number, payload: any) {
        try {
            const response = await api.patch(`/routine-tasks/task/${id}/update-progress/`, payload);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.weight || e.response.data.error || e.response.data.non_field_errors || 'Error Updating Progress of Task';
            throw new Error(msg);
        }
    }
    static async DeleteTask(id: number) {
        try {
            const response = await api.delete(`/routine-tasks/task/${id}/`);
            return response.data;
        } catch (e: any) {
            console.log('Delete Goal Error:', e);
            const msg = e.response.data.detail || 'Error Deleting Task';
            throw new Error(msg);
        }
    }

    // Analytics and Performance Related
    static async TaskAnalytics() {
        try {
            const response = await api.get(`/routine-tasks/task/analytics/`);
            return response.data;
        } catch (e: any) {
            console.log('Error Get Task Analytics:', e);
            const msg = e.response.data.detail || 'Error Get Task Analytics';
            throw new Error(msg);
        }
    }
}
