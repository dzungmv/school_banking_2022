import Home from '@/pages/Home';
import Login from '@/pages/Auth/Login/';
import OTP from '@/pages/Auth/OTP/';
import HistoryPayment from '@/pages/HistoryPayment/';

const PublicRoutes = [
    {
        path: '/login',
        component: Login,
        layout: null,
    },
];

const PrivateRoutes = [
    {
        path: '/',
        component: Home,
    },

    { path: `/otp`, component: OTP },

    {
        path: '/history-payment',
        component: HistoryPayment,
    },
];

export { PublicRoutes, PrivateRoutes };
