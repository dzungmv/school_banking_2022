import axios from '@/api/axiosClient';

const refreshToken = () => {
    return axios.post('v1/auth/refresh');
};

const Login = (username, password) => {
    return axios.post('v1/auth/login', { username, password });
};

const Logout = async () => {
    return axios.post('v1/auth/logout');
};

export { Login, Logout, refreshToken };
