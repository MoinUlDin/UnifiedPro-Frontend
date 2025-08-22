import api from '../utils/api';
import { setEmployees, setTerminateEmployees, setEmployeeDashbord } from '../store/slices/employeeSlice';

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
    static async FetchEmployeesDashboard(dispatch: any) {
        try {
            const response = await api.get(`/routine-tasks/employee-dashboard/`);
            dispatch(setEmployeeDashbord(response.data));
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

    static async AddLeaveRequests(payload: any) {
        try {
            const response = await api.post(`/routine-tasks/leave-request/`, payload);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async UpdateLeaveRequests(id: number, payload: any) {
        try {
            const response = await api.patch(`/routine-tasks/leave-request/${id}/`, payload);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async DeleteLeaveRequests(id: number) {
        try {
            const response = await api.patch(`/routine-tasks/leave-request/${id}/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    // Create Menutes of Meeting Calls
    static async FetchMeetings() {
        try {
            const response = await api.get(`/routine-tasks/meetings/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async FetchMeetingDetails(id: number) {
        try {
            const response = await api.get(`/routine-tasks/meetings/${id}/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async CreateMeetings(payload: any) {
        try {
            const response = await api.post(`/routine-tasks/meetings/`, payload);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async UpdateMeetings(id: number, payload: any) {
        try {
            const response = await api.patch(`/routine-tasks/meetings/${id}/`, payload);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.detail || e;
            throw new Error(msg);
        }
    }
    static async DeleteMeetings(id: number) {
        try {
            const response = await api.delete(`/routine-tasks/meetings/${id}/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async ToggelActionItem(id: number) {
        try {
            const response = await api.post(`/routine-tasks/action-items/${id}/toggle/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    // Clockin-out & attentence calls
    static async FetchAttendence() {
        try {
            const response = await api.get(`/routine-tasks/attendace/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async MarkClockIn() {
        try {
            const response = await api.post(`/routine-tasks/mark-clock-in/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async MarkClockOut() {
        try {
            const payload = { mark_clock_out: true };
            const response = await api.post(`/routine-tasks/mark-clock-out/`, payload);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    // Mark Holidays
    static async FetchHolidays() {
        try {
            const response = await api.get(`/routine-tasks/holidays/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async MarkHolidays(payload: any) {
        try {
            const response = await api.post(`/routine-tasks/holidays/`, payload);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
