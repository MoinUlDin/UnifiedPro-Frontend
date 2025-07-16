import api from '../utils/api';
export default class AuthServices {
    static async login(payload: any) {
        try {
            const response = await api.post('/auth/login/', payload);
            const { access, refresh } = response.data;
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
