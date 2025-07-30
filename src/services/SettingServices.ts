import api from '../utils/api';
import { setDepartmentList } from '../store/slices/settingSlice';

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
    static async UpdatePM(id: number, payload: any) {
        try {
            const response = await api.patch(`/company-performace/performance-monitoring/${id}/`, payload);
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
    static async updateCompanyInfo(id: number, payload: any) {
        try {
            const response = await api.patch(`/company-Setup/company-info/${id}/`, payload);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e?.response?.data?.website?.[0] || e.response.data?.email?.[0] || 'Error Updating Info';
            throw new Error(msg);
        }
    }
    static async fetchDepartments(dispatch: any) {
        try {
            const response = await api.get(`/company-Setup/departments/`);
            dispatch(setDepartmentList(response.data));
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
    static async AddWorkingDay(payload: any) {
        try {
            const response = await api.post(`/company-Setup/working-days/`, payload);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.day_name || 'Error Adding New day';
            throw new Error(msg);
        }
    }
    static async UpdateWorkingDay(id: number, payload: any) {
        try {
            const response = await api.patch(`/company-Setup/working-days/${id}/`, payload);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async DeleteWorkingDay(id: Number) {
        try {
            const response = await api.delete(`/company-Setup/working-days/${id}/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
