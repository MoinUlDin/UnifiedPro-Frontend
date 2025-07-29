import api from '../utils/api';

export default class CompanySetupServices {
    static async FetchGroupPermissions() {
        try {
            const response = await api.get(`/company-Setup/get-group-permissions/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async AddGroupPermission(payload: any) {
        try {
            const response = await api.post(`/company-Setup/group-permissions/`, payload);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async FetchPermissionList() {
        try {
            const response = await api.get(`/company-Setup/get-permissions-list/`);
            return response.data;
        } catch (e: any) {
            console.log('Add Gaol error: ', e);
            const msg = e.response.data.weight || 'Error Creating Goal';
            throw new Error(msg);
        }
    }
    static async GetUserPermissionGroup() {
        try {
            const response = await api.get(`/company-Setup/user-permission-groups/`);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.weight || 'Error Updating Goal';
            throw new Error(msg);
        }
    }
    static async AddUserPermissionGroup(payload: any) {
        try {
            const response = await api.post(`/company-Setup/user-permission-groups/`, payload);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.weight || 'Error Updating Goal';
            throw new Error(msg);
        }
    }
}
