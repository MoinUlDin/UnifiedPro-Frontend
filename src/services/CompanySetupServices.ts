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
            const response = await api.post(`/company-Setup/groups/`, payload);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async DeleteGroupPermission(id: number) {
        try {
            const response = await api.delete(`/company-Setup/groups/${id}/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async FetchCorePermissions() {
        try {
            const response = await api.get(`/company-Setup/permissions/`);
            return response.data;
        } catch (e: any) {
            console.log('Add Gaol error: ', e);
            const msg = e.response.data.weight || 'Error Creating Goal';
            throw new Error(msg);
        }
    }
    static async FetchUserPermissionGroupList() {
        try {
            const response = await api.get(`/company-Setup/groups/`);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.weight || 'Error Updating Goal';
            throw new Error(msg);
        }
    }
    static async FetchPermissionsInGroup(id: number) {
        try {
            const response = await api.get(`/company-Setup/groups/${id}/permissions/`);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.weight || 'Error Updating Goal';
            throw new Error(msg);
        }
    }
    static async BulkUpdatePermissions({ groupId, permissions }: { groupId: number; permissions: any }) {
        try {
            console.log('sending data: ', permissions);
            const response = await api.put(`/company-Setup/groups/${groupId}/permissions/`, permissions);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.weight || 'Error Updating Goal';
            throw new Error(msg);
        }
    }
}
