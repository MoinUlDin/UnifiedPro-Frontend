import api from '../utils/api';
import { setEmployees } from '../store/slices/employeeSlice';

export default class EmployeeServices {
    static async FetchEmployees(dispatch: any) {
        try {
            const response = await api.get(`/auth/employees/`);
            dispatch(setEmployees(response.data));
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async FetchEmployeeDetail(id: number) {
        try {
            const response = await api.get(`/auth/employees/${id}/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async AddEmployee(payload: any) {
        try {
            const response = await api.post(`/auth/employee-register/`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.email || e.response.data.profile_image || e.response.data.password[1] || 'Error Adding Employee. Please Try Strong Password';
            throw new Error(msg);
        }
    }
    static async UpdateEmployee(id: number, payload: any) {
        try {
            const response = await api.patch(`/auth/employees/${id}/`, payload);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async DeleteEmployee(id: number) {
        try {
            const response = await api.delete(`/auth/employees/${id}/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
