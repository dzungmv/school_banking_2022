import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/_redux/features/user/userSlice';
import { Logout, refreshToken } from '@/api/userApi';
import { getTuitionHistory } from '@/api/tuitionApi';
import { toast } from 'react-toastify';
import {
    resetTuitionData,
    setTuitionHistory,
} from '@/_redux/features/tuition/tuitionSlice';

import styles from './Header.module.scss';
import logo from '@/assets/images/logo.png';

const cx = classNames.bind(styles);

function Tooltip({ headerRef }) {
    const history = useNavigate();

    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const handleRedirectHistoryPayment = async () => {
        let res = await getTuitionHistory();

        if (res?.status === 401) {
            res = await refreshToken();
            res = await getTuitionHistory();
        }

        headerRef.current._tippy.hide();
        dispatch(setTuitionHistory(res.data));
        history('/history-payment');
    };

    const handleLogout = async () => {
        let res = await Logout();

        if (res?.status === 401) {
            res = await refreshToken();
            res = await Logout();
        }
        dispatch(resetTuitionData());
        dispatch(logout());
        dispatch(setTuitionHistory([]));
        history('/login');
        toast.success('Logout successfully!');
    };

    return (
        <div className={cx('tooltip')}>
            <div className={cx('info')}>
                <div className={cx('info__avatar')}>
                    <img src={logo} alt='' />
                </div>
                <div className={cx('info__item')}>
                    <span className={cx('info__item--name')}>
                        {user?.fullname}
                    </span>
                    <span className={cx('info__item--phone')}>
                        {user?.phone}
                    </span>
                </div>
            </div>

            <div
                className={cx('tooltip__item')}
                onClick={handleRedirectHistoryPayment}
            >
                <i className={cx('fa-regular', ' fa-rectangle-history')}></i>
                <span>History payment</span>
            </div>

            <hr />

            {/* <Link to='/login'> */}
            <div className={cx('tooltip__item')} onClick={handleLogout}>
                <i className={cx('fa-regular', 'fa-right-from-bracket')}></i>
                <span>Log out</span>
            </div>
            {/* </Link> */}
        </div>
    );
}

export default Tooltip;
