import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import OtpInput from 'react-otp-input';

import { sendOTP, verifyOTP, getNewSurplus } from '@/api/tuitionApi';
import { updateSurplus } from '@/_redux/features/user/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { refreshToken } from '@/api/userApi';
import Loading from '@/layouts/DefaultLayout/Loading';
import LoadingIcon from '@/layouts/DefaultLayout/Loading_Icon/LoadingIcon';

import styles from './OTP.module.scss';

import useEnterKeyListener from '@/hooks/useEnterKeyListener';

const cx = classNames.bind(styles);

const style = {
    separaStyle: {
        color: 'rgba(22,24,35,0.2)',
    },

    inputStyle: {
        width: '100%',
        height: '40px',
        fontSize: '20px',
        border: '1px solid rgba(22,24,35,0.2)',
        borderRadius: '5px',
        color: 'black',
    },
};

function OTP() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingResend, setLoadingResend] = useState(false);

    const user = useSelector((state) => state.user.user);
    const studentID = useSelector(
        (state) => state.tuition.tuition_data.student_id
    );

    const handleChangeOtp = (otp) => {
        setOtp(otp);
    };

    useEnterKeyListener({
        querySelectorToExecuteClick: '#btn_veryfy_otp',
    });

    const handleConfirmOTP = async () => {
        if (otp.length !== 6) {
            toast.error('OTP must be 6 digits');
            return;
        }

        setLoading(true);
        let res = await verifyOTP(user.id, otp);

        console.log('Check res 1', res);

        if (res?.status === 401) {
            res = await refreshToken();
            res = await verifyOTP(user.id, otp);
        }

        if (res?.status === 400) {
            toast.error('Token invalid or expired. Please try again.');
            setLoading(false);
            return;
        }

        if (res?.data?.error) {
            toast.error(res?.data?.error);
            setLoading(false);
            return;
        }

        toast.success('Tuition payment successfully!');

        let updateBalanceUser = await getNewSurplus(user.id);

        if (updateBalanceUser?.status === 401) {
            updateBalanceUser = await refreshToken();
            updateBalanceUser = await getNewSurplus(user.id);
        }
        dispatch(updateSurplus(updateBalanceUser?.data?.surplus));
        navigate('/');
        setLoading(false);
    };

    const handleResendOTP = async () => {
        setLoadingResend(true);
        let res = await sendOTP(user.id, studentID);

        if (res?.status === 401) {
            res = await refreshToken();
            res = await sendOTP(user.id, studentID);
        }

        toast.success('OTP re-sent successfully!');
        setLoadingResend(false);
    };

    return (
        <>
            {loading && <Loading />}
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('header')}>
                        <div className={cx('header__title')}>
                            Email verification
                        </div>
                        <p className={cx('header__des')}>
                            We have sent a verification code to your email
                            &nbsp;
                            <span>{user?.email}</span>.
                        </p>
                    </div>

                    <div className={cx('otp__form')}>
                        <OtpInput
                            inputStyle={style.inputStyle}
                            value={otp}
                            onChange={handleChangeOtp}
                            numInputs={6}
                            separator={<span>&nbsp; &nbsp;</span>}
                            hasErrored
                            shouldAutoFocus
                            isInputNum
                        />
                    </div>

                    <div className={cx('btn__confirm')}>
                        <button
                            id={'btn_veryfy_otp'}
                            onClick={handleConfirmOTP}
                            disabled={loading}
                        >
                            Confirm
                        </button>
                    </div>

                    <div className={cx('footer')}>
                        <div className={cx('footer__item')}>
                            <div className={cx('footer__item--des')}>
                                Don't receive code?
                            </div>

                            <div className={cx('resend-btn')}>
                                {loadingResend ? (
                                    <LoadingIcon />
                                ) : (
                                    <button onClick={handleResendOTP}>
                                        Resend
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OTP;
