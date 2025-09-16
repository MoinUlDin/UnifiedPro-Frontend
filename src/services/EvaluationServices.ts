// src/services/EvaluationServices.ts
import api from '../utils/api';

export default class EvaluationServices {
    static async fetchFormCreation() {
        try {
            const response = await api.get(`/privacy-evel/templates/get-form-builder/`);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response?.data || e.message;
            throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
        }
    }

    static async listTemplates() {
        try {
            const r = await api.get('/privacy-evel/templates/');
            return r.data;
        } catch (e: any) {
            throw new Error(e.response?.data || e.message);
        }
    }

    static async createTemplate(payload: any) {
        try {
            const r = await api.post('/privacy-evel/templates/', payload);
            return r.data;
        } catch (e: any) {
            throw new Error(e.response?.data || e.message);
        }
    }

    static async createVersion(payload: any) {
        try {
            const r = await api.post('/privacy-evel/versions/', payload);
            return r.data;
        } catch (e: any) {
            throw new Error(e.response?.data || e.message);
        }
    }

    static async listAssignments() {
        try {
            const r = await api.get('/privacy-evel/assignments/');
            return r.data;
        } catch (e: any) {
            throw new Error(e.response?.data || e.message);
        }
    }

    static async createAssignment(payload: any) {
        try {
            const r = await api.post('/privacy-evel/assignments/', payload);
            return r.data;
        } catch (e: any) {
            throw new Error(e.response?.data || e.message);
        }
    }

    static async listSubmissions() {
        try {
            const r = await api.get('/privacy-evel/submissions/');
            return r.data;
        } catch (e: any) {
            throw new Error(e.response?.data || e.message);
        }
    }

    static async createSubmission(payload: any) {
        try {
            const r = await api.post('/privacy-evel/submissions/', payload);
            return r.data;
        } catch (e: any) {
            throw new Error(e.response?.data || e.message);
        }
    }

    static async retrieveSubmission(id: number | string) {
        try {
            const r = await api.get(`/privacy-evel/submissions/${id}/`);
            return r.data;
        } catch (e: any) {
            throw new Error(e.response?.data || e.message);
        }
    }

    static async aggregateForTarget(targetId: number | string, params?: Record<string, any>) {
        try {
            const qs = params ? '?' + new URLSearchParams(params).toString() : '';
            const r = await api.get(`/privacy-evel/submissions/aggregate/${targetId}/${qs}`);
            return r.data;
        } catch (e: any) {
            throw new Error(e.response?.data || e.message);
        }
    }

    static async postComment(submissionId: number | string, payload: any) {
        try {
            const r = await api.post(`/privacy-evel/submissions/${submissionId}/comment/`, payload);
            return r.data;
        } catch (e: any) {
            throw new Error(e.response?.data || e.message);
        }
    }
}
