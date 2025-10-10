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
            throw e;
        }
    }

    static async createTemplate(payload: any) {
        try {
            const r = await api.post('/privacy-evel/templates/', payload);
            return r.data;
        } catch (e: any) {
            throw e;
        }
    }
    static async CreateUpdateTemplateWithQuestions(payload: any) {
        // this will Create or update
        try {
            const r = await api.post('/privacy-evel/templates/create-or-update-with-questions/', payload);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }
    static async deleteTemplate(id: number, payload: any = null) {
        try {
            const r = await api.delete(`/privacy-evel/templates/${id}/`, payload);
            return r.data;
        } catch (e: any) {
            throw e;
        }
    }

    static async createVersion(payload: any) {
        try {
            const r = await api.post('/privacy-evel/versions/', payload);
            return r.data;
        } catch (e: any) {
            throw e;
        }
    }
    static async listVersions() {
        try {
            const r = await api.get('/privacy-evel/versions/');
            return r.data;
        } catch (e: any) {
            throw e;
        }
    }

    static async listAssignments() {
        try {
            const r = await api.get('/privacy-evel/assignments/');
            return r.data;
        } catch (e: any) {
            throw e;
        }
    }

    static async createAssignment(payload: any) {
        try {
            console.log('sending Payload: ', payload);
            const r = await api.post('/privacy-evel/assignments/', payload);
            return r.data;
        } catch (e: any) {
            console.log('Org Error: ', e);
            throw e;
        }
    }

    static async listSubmissions() {
        try {
            const r = await api.get('/privacy-evel/submissions/');
            return r.data;
        } catch (e: any) {
            throw e;
        }
    }

    static async createSubmission(payload: any) {
        try {
            const r = await api.post('/privacy-evel/submissions/', payload);
            return r.data;
        } catch (e: any) {
            throw e;
        }
    }

    static async retrieveSubmission(id: number | string) {
        try {
            const r = await api.get(`/privacy-evel/submissions/${id}/`);
            return r.data;
        } catch (e: any) {
            throw e;
        }
    }

    static async aggregateForTarget(targetId: number | string, params?: Record<string, any>) {
        try {
            const qs = params ? '?' + new URLSearchParams(params).toString() : '';
            const r = await api.get(`/privacy-evel/submissions/aggregate/${targetId}/${qs}`);
            return r.data;
        } catch (e: any) {
            throw e;
        }
    }

    static async postComment(submissionId: number | string, payload: any) {
        try {
            const r = await api.post(`/privacy-evel/submissions/${submissionId}/comment/`, payload);
            return r.data;
        } catch (e: any) {
            throw e;
        }
    }
    // Assignments

    static async fetchAllAssignments() {
        try {
            const r = await api.get(`/privacy-evel/assignments/`);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }
    static async assignmentOptions(id: number) {
        try {
            const r = await api.get(`/privacy-evel/assignments/assignment-options/?template_version=${id}`);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }
    static async getEmployeeMangerAssignments() {
        try {
            const r = await api.get(`/privacy-evel/assignments/employee-manager/`);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }
    static async get360Assignments() {
        try {
            const r = await api.get(`/privacy-evel/assignments/360/`);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }
    static async getSelfAssignments() {
        try {
            const r = await api.get(`/privacy-evel/assignments/self/`);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }
    static async getManagerAssignments() {
        try {
            const r = await api.get(`/privacy-evel/assignments/manager/`);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }

    // Submition
    static async getAssignmentQuestions(id: number) {
        try {
            const r = await api.get(`/privacy-evel/assignments/${id}/get_questions/`);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }
    static async submitResponses(id: number, payload: any) {
        try {
            const r = await api.post(`/privacy-evel/submissions/submit_form/`, payload);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }
    static async fetchManagerSubmitted() {
        try {
            const r = await api.get(`/privacy-evel/submissions/submitted_list_manager/`);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }
    static async fetchAggregatedResults(f_type: 'self' | 'manager' | '360' | 'employee_manager') {
        try {
            const r = await api.get(`/privacy-evel/submissions/aggregate_results/?form_type=${f_type}`);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }
    static async fetchSelfSubmitted() {
        try {
            const r = await api.get(`/privacy-evel/submissions/submitted_list_self/`);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }

    static async saveDraft(id: number, payload: any) {
        try {
            const r = await api.get(`//`);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }

    // Comments on submitions
    static async getSubmissionComments(id: number) {
        try {
            const r = await api.get(`/privacy-evel/comments/by-submission/${id}/`);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }
    static async postSubmissionComment(payload: any) {
        try {
            console.log('payload: ', payload);
            const r = await api.post(`/privacy-evel/comments/`, payload);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }

    // System Metrics
    static async fetchAllSystemMatrix() {
        try {
            const r = await api.get(`/privacy-evel/metrics/`);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }
    static async deleteSystemMatrix(id: number) {
        try {
            const r = await api.delete(`/privacy-evel/metrics/${id}`);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }
    static async createSystemMatrix(payload: any) {
        try {
            console.log('payload: ', payload);
            const r = await api.post(`/privacy-evel/metrics/`, payload);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }
    static async updateSystemMatrix(id: number, payload: any) {
        try {
            console.log('payload: ', payload);
            const r = await api.patch(`/privacy-evel/metrics/${id}/`, payload);
            return r.data;
        } catch (e: any) {
            console.log('org Error: ', e);
            throw e;
        }
    }
}
