import api from '../utils/api';

function objectToFormData(obj: Record<string, any>) {
    const fd = new FormData();

    Object.entries(obj).forEach(([k, v]) => {
        if (v === undefined || v === null) return;

        // If the value is a File/Blob, append directly
        if (v instanceof File || v instanceof Blob) {
            fd.append(k, v);
        } else if (Array.isArray(v)) {
            // append arrays as repeated fields: `key[]=value`
            v.forEach((item) => {
                // for file array items:
                if (item instanceof File || item instanceof Blob) {
                    fd.append(k, item);
                } else {
                    fd.append(k + '[]', item);
                }
            });
        } else if (typeof v === 'object') {
            // nested objects -> stringify (or implement deeper recursion if desired)
            fd.append(k, JSON.stringify(v));
        } else {
            fd.append(k, String(v));
        }
    });

    return fd;
}

export default class OwnerServices {
    static async fetchProfile() {
        try {
            const response = await api.get(`/company-Setup/owner/profile/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    static async updateProfile(payload: any) {
        try {
            const data = payload instanceof FormData ? payload : objectToFormData(payload);

            // Important: do NOT set 'multipart/form-data' string here.
            // Setting Content-Type = undefined makes axios omit the header and lets the browser set it (with boundary).
            const response = await api.patch('/company-Setup/owner/profile/', data, {
                headers: {
                    'Content-Type': undefined,
                },
                // avoid axios transforming the body
                transformRequest: (d) => d,
            });

            return response.data;
        } catch (e) {
            console.error('updateProfile error:', e);
            throw e;
        }
    }
    static async changePassword(payload: any) {
        try {
            const response = await api.post(`/auth/change-password/`, payload);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async getOwnerDashboard() {
        try {
            const response = await api.get(`/company-Setup/owner/dashboard/`);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
