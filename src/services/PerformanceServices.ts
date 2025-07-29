import api from '../utils/api';

export default class PerformanceServices {
    static async TaskAnalytics() {
        try {
            const response = await api.get(`/routine-tasks/task/analytics/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async KPIAnalytics() {
        try {
            const response = await api.get(`/company-performace/department-kpi/analytics/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async KPIPerformance(id: number) {
        try {
            const response = await api.get(`/company-performace/department-kpi/${id}/performance/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async FetchCompanyPerformance() {
        try {
            const response = await api.get(`/company-performace/company/performance/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
