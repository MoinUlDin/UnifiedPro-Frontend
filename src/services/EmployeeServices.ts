import api from '../utils/api';
import { setEmployees, setTerminateEmployees } from '../store/slices/employeeSlice';

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
            console.log('sending payload: ', payload);
            const response = await api.patch(`/auth/employees/${id}/`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
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
    static async FetchTerminatedEmployees(dispatch: any) {
        try {
            const response = await api.get(`/company-Setup/terminate-employee/`);
            dispatch(setTerminateEmployees(response.data));
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async TerminateEmployee(payload: any) {
        try {
            const response = await api.post(`/company-Setup/terminate-employee/`, payload);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.email || e.response.data.profile_image || e.response.data.password[1] || 'Error Adding Employee. Please Try Strong Password';
            throw new Error(msg);
        }
    }
    static async UndoTermination(payload: any) {
        try {
            const response = await api.post(`/company-Setup/undo-termination/`, payload);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.email || e.response.data.profile_image || e.response.data.password[1] || 'Error Adding Employee. Please Try Strong Password';
            throw new Error(msg);
        }
    }
    static async UpdateTerminatedEmployee(id: number, payload: any) {
        try {
            console.log('sending payload: ', payload);
            const response = await api.patch(`/company-Setup/terminate-employee/${id}/`, payload);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async DeleteTerminatedEmployee(id: number) {
        try {
            const response = await api.delete(`/company-Setup/terminate-employee/${id}/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    // leave requests
    static async FetchLeaveRequests() {
        try {
            const response = await api.get(`/routine-tasks/leave-request/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async ApproveLeaveRequest(id: number, payload: any) {
        try {
            // need to fix the urls with correct one later
            const response = await api.patch(`/routine-tasks/approve-leave/${id}/`, payload);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data?.detail || e;
            throw new Error(msg);
        }
    }
    static async DeleteLeaveRequest(id: number) {
        try {
            // need to fix the urls with correct one later
            const response = await api.delete(`/routine-tasks/leave-request/${id}/`);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data?.detail || e;
            throw new Error(msg);
        }
    }
}
