import api from '../utils/api';
import { setCG, setAllGaolsList } from '../store/slices/settingSlice';

export default class CompanyGoalServices {
    static async FetchGoals(dispatch: any) {
        try {
            const response = await api.get(`/company-performace/company-goal/`);
            dispatch && dispatch(setCG(response.data));
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async FetchAllGoalsInOneGo(dispatch: any) {
        try {
            const response = await api.get(`/company-performace/get_all_in_one/`);
            dispatch && dispatch(setAllGaolsList(response.data));
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static async AddGoal(payload: any) {
        try {
            const response = await api.post(`/company-performace/company-goal/`, payload);
            return response.data;
        } catch (e: any) {
            const msg = e.response.data.weight || 'Error Creating Goal';
            throw new Error(msg);
        }
    }
    static async UpdateGoal(id: number, payload: any) {
        try {
            const response = await api.patch(`/company-performace/company-goal/${id}/`, payload);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = e.response.data.weight || 'Error Updating Goal';
            throw new Error(msg);
        }
    }
    static async DeleteGoal(id: number) {
        try {
            const response = await api.delete(`/company-performace/company-goal/${id}/`);
            return response.data;
        } catch (e: any) {
            console.log(e);
            const msg = 'Error Deleting Goal';
            throw new Error(msg);
        }
    }
}
