import axios from '@/api/axiosClient';

const getTuitionById = async (student_id) => {
    return axios.get(`v1/account/tuition/${student_id}`);
};

const sendOTP = (id, student_id) => {
    return axios.post(`v1/account/otp`, { userID: id, mssv: student_id });
};

const verifyOTP = (id, otp) => {
    return axios.put(`v1/account/otp`, { userID: id, otp: otp });
};

const getNewSurplus = (userID) => {
    return axios.get(`v1/account/surplus/${userID}`);
};

const getTuitionHistory = () => {
    return axios.get(`v1/account/history`);
};

export { getTuitionById, sendOTP, verifyOTP, getNewSurplus, getTuitionHistory };
