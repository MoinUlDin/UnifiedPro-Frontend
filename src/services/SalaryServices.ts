import api from '../utils/api';

export default class SalaryServices {
    //  Job Types
    static async FetchJobs() {
        try {
            const response = await api.get(`/routine-tasks/Job-type/`);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.user || 'error fetching Jobs Data';
            throw new Error(msg);
        }
    }
    static async AddJob(payload: any) {
        try {
            const response = await api.post(`/routine-tasks/Job-type/`, payload);
            return response.data;
        } catch (e: any) {
            console.log('Add Job error: ', e);
            const msg = e.response.data.weight || 'Error Creating Job';
            throw new Error(msg);
        }
    }
    static async UpdateJob(id: number, payload: any) {
        try {
            const response = await api.patch(`/routine-tasks/Job-type/${id}/`, payload);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.weight || 'Error Updating Job';
            throw new Error(msg);
        }
    }
    static async DeleteJob(id: number) {
        try {
            const response = await api.delete(`/routine-tasks/Job-type/${id}/`);
            return response.data;
        } catch (e: any) {
            console.log('Delete Job Error:', e);
            const msg = 'Error Deleting Job';
            throw new Error(msg);
        }
    }
    //  PayGrade types
    static async FetchPayGrade() {
        try {
            const response = await api.get(`/routine-tasks/pay-grade/`);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.user || 'error fetching Jobs Data';
            throw new Error(msg);
        }
    }
    static async AddPayGrade(payload: any) {
        try {
            const response = await api.post(`/routine-tasks/pay-grade/`, payload);
            return response.data;
        } catch (e: any) {
            console.log('Add Job error: ', e);
            const msg = e.response.data.weight || 'Error Creating Job';
            throw new Error(msg);
        }
    }
    static async UpdatePayGrade(id: number, payload: any) {
        try {
            const response = await api.patch(`/routine-tasks/pay-grade/${id}/`, payload);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.weight || 'Error Updating Job';
            throw new Error(msg);
        }
    }
    static async DeletePayGrade(id: number) {
        try {
            const response = await api.delete(`/routine-tasks/pay-grade/${id}/`);
            return response.data;
        } catch (e: any) {
            console.log('Delete Job Error:', e);
            const msg = 'Error Deleting Job';
            throw new Error(msg);
        }
    }
}
