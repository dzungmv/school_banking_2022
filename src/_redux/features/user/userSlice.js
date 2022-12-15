import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: { id: '', fullname: '', email: '', phone: '', surplus: '' },
        isLogin: false,
    },

    reducers: {
        login: (state, action) => {
            state.user = {
                id: action?.payload?.id,
                fullname: action?.payload?.fullname,
                email: action?.payload?.email,
                phone: action?.payload?.phone,
                surplus: action?.payload?.surplus,
            };

            //     user: {
            //         fullname: action?.payload?.data?.fullname;
            //         email: action?.payload?.data?.email;
            //         phone: action?.payload?.data?.phone;
            //         surplus: action?.payload?.data?.surplus;
            //     }
            state.isLogin = true;
        },

        updateSurplus: (state, action) => {
            console.log(action);
            state.user.surplus = action?.payload;
        },

        logout: (state) => {
            state.user = {
                id: '',
                fullname: '',
                email: '',
                phone: '',
                surplus: '',
            };
            state.isLogin = false;
        },
    },
});

export const { login, updateSurplus, logout } = userSlice.actions;
export default userSlice.reducer;
