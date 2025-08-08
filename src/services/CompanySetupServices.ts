import api from '../utils/api';
import { setAnnouncements } from '../store/slices/companySlice';

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
    static async FetchMemberListInGroup(id: number) {
        try {
            const response = await api.get(`/company-Setup/groups/${id}/members/`);
            return response.data;
        } catch (e: any) {
            console.log('Error Fetching member List: ', e);
            const msg = e.response.data.weight || 'Error Fetching member List';
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
            const msg = e.response.data.weight || 'Error Fetching Permissions in a group';
            throw new Error(msg);
        }
    }
    static async FetchDetailedGroupList() {
        try {
            const response = await api.get(`/company-Setup/groups/detailed-group-list/`);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.weight || 'Error Getting Detailed Group List';
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

    static async FetchMemeberForPermisssion() {
        try {
            const res = await api.get(`/company-Setup/employees_for_permisions`);
            return res.data;
        } catch (e: any) {
            console.log(e);
            throw e;
        }
    }
    static async UpdateGroupMembers(groupId: number, payload: { userIds: number[] }) {
        try {
            const res = await api.patch(`/company-Setup/groups/${groupId}/members/`, payload);
            return res.data;
        } catch (e: any) {
            console.log('Error Updating Group Member', e);
        }
    }
    // Annoncements
    static async FetchAnnouncements(dispatch: any) {
        try {
            const res = await api.get(`/company-Setup/announcement/`);
            dispatch(setAnnouncements(res.data));
            return res.data;
        } catch (e: any) {
            console.log('Error Fetching Annoncements', e);
        }
    }
    static async AddAnnouncements(payload: any) {
        try {
            const res = await api.post(`/company-Setup/announcement/`, payload, {
                headers: { 'Content-Type': 'multipart/formdata' },
            });
            return res.data;
        } catch (e: any) {
            console.log('Error Fetching Annoncements', e);
        }
    }
    static async UpdateAnnouncements(id: number, payload: any) {
        try {
            const res = await api.patch(`/company-Setup/announcement/${id}/`, payload, {
                headers: { 'Content-Type': 'multipart/formdata' },
            });
            return res.data;
        } catch (e: any) {
            console.log('Error Fetching Annoncements', e);
        }
    }
    static async DeleteAnnouncements(id: number) {
        try {
            const res = await api.delete(`/company-Setup/announcement/${id}/`);
            return res.data;
        } catch (e: any) {
            console.log('Error Deleting Annoncements', e);
        }
    }
}
