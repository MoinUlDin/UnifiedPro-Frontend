import api from '../utils/api';
export default class SettingServices {
    static async FetchPerformanceMonitoring() {
        try {
            const response = await api.get('/company-performace/performance-monitoring/');
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async AddPM(payload: any) {
        try {
            const response = await api.post('/company-performace/performance-monitoring/', payload);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async detetePM(id: number) {
        try {
            const response = await api.delete(`/company-performace/performance-monitoring/${id}/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async fetchCompanyInfo() {
        try {
            const response = await api.get(`/company-Setup/company-info/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async fetchDepartments() {
        try {
            const response = await api.get(`/company-Setup/departments/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async AddDepartment(payload: any) {
        try {
            const response = await api.post(`/company-Setup/departments/`, payload);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async UpdateDepartment(id: number, payload: any) {
        try {
            const response = await api.patch(`/company-Setup/departments/${id}/`, payload);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async DeleteDepartment(id: Number) {
        try {
            const response = await api.delete(`/company-Setup/departments/${id}/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async fetchParentDepartments() {
        try {
            const response = await api.get(`/company-Setup-fkf/parent-departments/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async createDesignation(payload: any) {
        try {
            const response = await api.post(`/company-Setup/designations/`, payload);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async fetchDesignations() {
        try {
            const response = await api.get(`/company-Setup/designations/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async deleteDesignation(id: number) {
        try {
            const response = await api.delete(`/company-Setup/designations/${id}/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async updateDesignation(id: number, payload: any) {
        try {
            const response = await api.patch(`/company-Setup/designations/${id}/`, payload);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
