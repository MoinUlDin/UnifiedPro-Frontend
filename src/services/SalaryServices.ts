import api from '../utils/api';
import { setAllStructures } from '../store/slices/companySlice';
export default class SalaryServices {
    //  Job Calls
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
    //  PayGrade Calls
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
    //  Salary Component Calls
    static async FetchSalaryComponent() {
        try {
            const response = await api.get(`/routine-tasks/salary-component/`);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.user || 'error fetching Jobs Data';
            throw new Error(msg);
        }
    }
    static async AddSalaryComponent(payload: any) {
        try {
            const response = await api.post(`/routine-tasks/salary-component/`, payload);
            return response.data;
        } catch (e: any) {
            console.log('Add Job error: ', e);
            const msg = e.response.data.weight || 'Error Creating Job';
            throw new Error(msg);
        }
    }
    static async UpdateSalaryComponent(id: number, payload: any) {
        try {
            const response = await api.patch(`/routine-tasks/salary-component/${id}/`, payload);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.weight || 'Error Updating Job';
            throw new Error(msg);
        }
    }
    static async DeleteSalaryComponent(id: number) {
        try {
            const response = await api.delete(`/routine-tasks/salary-component/${id}/`);
            return response.data;
        } catch (e: any) {
            console.log('Delete Job Error:', e);
            const msg = 'Error Deleting Job';
            throw new Error(msg);
        }
    }
    //  PayFrequency Calls
    static async FetchPayFrequencies() {
        try {
            const response = await api.get(`/routine-tasks/pay-frequency/`);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.user || 'error fetching Jobs Data';
            throw new Error(msg);
        }
    }
    static async FetchPayFrequenciesNames() {
        try {
            const response = await api.get(`/routine-tasks/pay-frequency/get_valid_names/`);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.user || 'error fetching Jobs Data';
            throw new Error(msg);
        }
    }
    static async AddPayFrequency(payload: any) {
        try {
            const response = await api.post(`/routine-tasks/pay-frequency/`, payload);
            return response.data;
        } catch (e: any) {
            console.log('Add Job error: ', e);
            const msg = e.response.data.weight || 'Error Creating Job';
            throw new Error(msg);
        }
    }
    static async UpdatePayFrequency(id: number, payload: any) {
        try {
            const response = await api.patch(`/routine-tasks/pay-frequency/${id}/`, payload);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.weight || 'Error Updating Job';
            throw new Error(msg);
        }
    }
    static async DeletePayFrequency(id: number) {
        try {
            const response = await api.delete(`/routine-tasks/pay-frequency/${id}/`);
            return response.data;
        } catch (e: any) {
            console.log('Delete Job Error:', e);
            const msg = 'Error Deleting Job';
            throw new Error(msg);
        }
    }
    //  PayFrequency Calls
    static async FetchDeduction() {
        try {
            const response = await api.get(`/routine-tasks/deduction/`);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.user || 'error fetching Jobs Data';
            throw new Error(msg);
        }
    }

    static async AddDeduction(payload: any) {
        try {
            const response = await api.post(`/routine-tasks/deduction/`, payload);
            return response.data;
        } catch (e: any) {
            console.log('Add Job error: ', e);
            const msg = e.response.data.weight || 'Error Creating Job';
            throw new Error(msg);
        }
    }
    static async UpdateDeduction(id: number, payload: any) {
        try {
            const response = await api.patch(`/routine-tasks/deduction/${id}/`, payload);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.weight || 'Error Updating Job';
            throw new Error(msg);
        }
    }
    static async DeleteDeduction(id: number) {
        try {
            const response = await api.delete(`/routine-tasks/deduction/${id}/`);
            return response.data;
        } catch (e: any) {
            console.log('Delete Job Error:', e);
            const msg = 'Error Deleting Job';
            throw new Error(msg);
        }
    }
    //  Basic Profile Calls
    static async FetchBasicProfile() {
        try {
            const response = await api.get(`/routine-tasks/basic-profile/`);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.user || 'error fetching Jobs Data';
            throw new Error(msg);
        }
    }

    static async AddBasicProfile(payload: any) {
        try {
            const response = await api.post(`/routine-tasks/basic-profile/`, payload);
            return response.data;
        } catch (e: any) {
            console.log('Add Job error: ', e);
            const msg = e.response.data.weight || 'Error Creating Job';
            throw new Error(msg);
        }
    }
    static async UpdateBasicProfile(id: number, payload: any) {
        try {
            const response = await api.patch(`/routine-tasks/basic-profile/${id}/`, payload);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.weight || 'Error Updating Job';
            throw new Error(msg);
        }
    }
    static async DeleteBasicProfile(id: number) {
        try {
            const response = await api.delete(`/routine-tasks/basic-profile/${id}/`);
            return response.data;
        } catch (e: any) {
            console.log('Delete Job Error:', e);
            const msg = 'Error Deleting Job';
            throw new Error(msg);
        }
    }
    // Salary Structure Calls
    static async FetchAllStructures(dispatch: any) {
        try {
            const response = await api.get(`/routine-tasks/salary-structure/get_all_structure_components/`);
            dispatch(setAllStructures(response.data));
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.user || 'error fetching Jobs Data';
            throw new Error(msg);
        }
    }
    static async FetchSalaryStructure() {
        try {
            const response = await api.get(`/routine-tasks/salary-structure/`);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.user || 'error fetching Jobs Data';
            throw new Error(msg);
        }
    }
    static async AddSalaryStructure(payload: any) {
        try {
            const response = await api.post(`/routine-tasks/salary-structure/`, payload);
            return response.data;
        } catch (e: any) {
            console.log('Add Job error: ', e);
            const msg = e.response.data.weight || 'Error Creating Job';
            throw new Error(msg);
        }
    }
    static async UpdateSalaryStructure(id: number, payload: any) {
        try {
            const response = await api.patch(`/routine-tasks/salary-structure/${id}/`, payload);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.weight || 'Error Updating Job';
            throw new Error(msg);
        }
    }
    static async DeleteSalaryStructure(id: number) {
        try {
            const response = await api.delete(`/routine-tasks/salary-structure/${id}/`);
            return response.data;
        } catch (e: any) {
            console.log('Delete Job Error:', e);
            const msg = 'Error Deleting Job';
            throw new Error(msg);
        }
    }
}
