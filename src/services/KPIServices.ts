import api from '../utils/api';

export default class KPIServices {
    static async FetchGoals() {
        try {
            const response = await api.get(`/company-performace/department-kpi/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    // static async FetchChildGoals(id: number) {
    //     try {
    //         const response = await api.get(`/company-performace/department-kpi/`);
    //         return response.data;
    //     } catch (e) {
    //         console.log(e);
    //         throw e;
    //     }
    // }
    static async AddGoal(payload: any) {
        try {
            const response = await api.post(`/company-performace/department-kpi/`, payload);
            return response.data;
        } catch (e: any) {
            console.log('Add Gaol error: ', e);
            const msg = e.response.data.weight || 'Error Creating Goal';
            throw new Error(msg);
        }
    }
    static async UpdateGoal(id: number, payload: any) {
        try {
            const response = await api.patch(`/company-performace/department-kpi/${id}/`, payload);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.weight || 'Error Updating Goal';
            throw new Error(msg);
        }
    }
    static async DeleteGoal(id: number) {
        try {
            const response = await api.delete(`/company-performace/department-kpi/${id}/`);
            return response.data;
        } catch (e: any) {
            console.log('Delete Goal Error:', e);
            const msg = 'Error Deleting Goal';
            throw new Error(msg);
        }
    }
}
