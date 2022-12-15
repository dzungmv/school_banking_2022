import { toast } from 'react-toastify';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { Box, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { refreshToken } from '@/api/userApi';

import { getTuitionById, sendOTP } from '@/api/tuitionApi';
import {
    setTuitionData,
    resetTuitionData,
} from '@/_redux/features/tuition/tuitionSlice';

import Modal from '@/layouts/DefaultLayout/Modal';
import styles from './Home.module.scss';
import Loading from '@/layouts/DefaultLayout/Loading';
import LoadingIcon from '@/layouts/DefaultLayout/Loading_Icon';
import useEnterKeyListener from '@/hooks/useEnterKeyListener';

const cx = classNames.bind(styles);

function Home() {
    const navigate = useNavigate();
    // Redux
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const tuition = useSelector((state) => state.tuition.tuition_data);
    const nullTuition = useSelector((state) => state.tuition.isNull);

    const [loading, setLoading] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [tuitionId, setTuitionId] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [paymentContainer, setPaymentContainer] = useState(false);

    // Find student tuition by ID handle
    useEnterKeyListener({
        querySelectorToExecuteClick: '#btn_search',
    });
    const handleClickFoundTuitionByID = async () => {
        if (!tuitionId) {
            toast.error('Please enter tuition ID!');
            return;
        }

        setLoading(true);

        let res = await getTuitionById(tuitionId);

        if (res?.status === 401) {
            res = await refreshToken();
            res = await getTuitionById(tuitionId);
        }

        if (res?.data?.error) {
            toast.error('StudentID not found!');
            setLoading(false);
            dispatch(resetTuitionData());
            return;
        }

        dispatch(setTuitionData(res?.data));
        setPaymentContainer(true);
        setLoading(false);
    };

    // Submit tuition handle
    const handleClickSubmitTuition = async () => {
        setLoadingModal(true);
        let res = await sendOTP(user.id, tuition.student_id);

        if (res?.status === 401) {
            res = await refreshToken();
            res = await getTuitionById(user.id, tuition.student_id);
        }

        if (res?.status === 403) {
            toast.error('Tuition is in the process of being paid!');
            setLoadingModal(false);
            return;
        }

        if (res?.data?.error) {
            toast.error(res?.data?.error);
            setLoadingModal(false);
            return;
        }

        navigate(`/otp`, { state: { id: user.id } });
        toast.success('OTP sent!');
        setLoadingModal(false);
    };

    // Modal handling
    useEffect(() => {
        if (openModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [openModal]);

    const handleOpenModal = () => {
        if (user?.surplus < tuition?.tuition_fee) {
            toast.error('Please check your balance!');
            return;
        } else {
            setOpenModal((prev) => !prev);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <>
            {loading && <Loading />}
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('header')}>
                        <div className={cx('container__item', 'information')}>
                            <div className={cx('heading')}>
                                <span className={cx('title')}>
                                    Account information
                                </span>
                            </div>

                            <div className={cx('form-control')}>
                                <Box
                                    component='form'
                                    sx={{
                                        display: 'flex',
                                    }}
                                >
                                    <TextField
                                        value={
                                            user?.fullname
                                                ?.split(' ')
                                                .slice(0, -1)
                                                .join(' ') || ''
                                        }
                                        label='Last name'
                                        variant='standard'
                                        sx={{
                                            flexGrow: 1,
                                            marginBottom: '12px',
                                        }}
                                        disabled
                                    />

                                    <TextField
                                        value={
                                            user?.fullname?.split(' ').pop() ||
                                            ''
                                        }
                                        label='First name'
                                        variant='standard'
                                        sx={{ flexGrow: 1 }}
                                        disabled
                                    />
                                </Box>

                                <Box
                                    component='form'
                                    sx={{
                                        display: 'flex',
                                    }}
                                >
                                    <TextField
                                        value={user?.phone || ''}
                                        label='Phone number'
                                        variant='standard'
                                        sx={{
                                            flexGrow: 1,
                                            marginBottom: '12px',
                                        }}
                                        disabled
                                    />
                                </Box>

                                <Box
                                    component='form'
                                    sx={{
                                        display: 'flex',
                                    }}
                                >
                                    <TextField
                                        value={user?.email || ''}
                                        label='Email'
                                        variant='standard'
                                        sx={{ flexGrow: 1 }}
                                        disabled
                                    />
                                </Box>
                            </div>
                        </div>

                        {/* Get Student By ID */}
                        <div className={cx('container__item', 'tuition__id')}>
                            <div className={cx('title')}>
                                Tuition student by ID
                            </div>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '8px 0 0 0',
                                }}
                                required
                            >
                                <TextField
                                    value={tuitionId}
                                    label='Student ID'
                                    variant='outlined'
                                    type={'search'}
                                    sx={{ flexGrow: 1 }}
                                    onChange={(e) =>
                                        setTuitionId(e.target.value.trim())
                                    }
                                />
                            </Box>

                            <div className={cx('btn-search')}>
                                <button
                                    id={'btn_search'}
                                    onClick={handleClickFoundTuitionByID}
                                    disabled={loading}
                                >
                                    Enter
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Payment Container */}
                    {paymentContainer && (
                        <div className={cx('tuition__container')}>
                            <div className={cx('title')}>Tuition/Payment</div>
                            <div className={cx('tuition')}>
                                <div className={cx('tuition__info')}>
                                    <div className={cx('form-control')}>
                                        <Box
                                            component='form'
                                            sx={{
                                                display: 'flex',
                                                gap: 2,
                                            }}
                                        >
                                            <TextField
                                                value={
                                                    tuition?.student_id || ''
                                                }
                                                label='Student ID'
                                                variant='standard'
                                                sx={{ flexGrow: 1 }}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                            <TextField
                                                value={tuition?.full_name || ''}
                                                label='Student name'
                                                variant='standard'
                                                sx={{ flexGrow: 1 }}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                        </Box>
                                    </div>

                                    {/* Payment Container - Tuition */}
                                    <div className={cx('form-control')}>
                                        <Box sx={{ display: 'flex' }}>
                                            <TextField
                                                value={
                                                    tuition?.tuition_fee || ''
                                                }
                                                label='Tuition'
                                                type={'number'}
                                                variant='standard'
                                                sx={{ flexGrow: 1 }}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />

                                            {!nullTuition && (
                                                <div className={cx('status')}>
                                                    Status:
                                                    {tuition?.tuition_status ===
                                                    0 ? (
                                                        <span
                                                            className={cx(
                                                                'status__debt'
                                                            )}
                                                        >
                                                            Tuition debt
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className={cx(
                                                                'status__comp'
                                                            )}
                                                        >
                                                            Tuition completed
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </Box>
                                    </div>
                                </div>

                                <div className={cx('tuition__payment')}>
                                    <div
                                        className={cx('tuition__payment--item')}
                                    >
                                        <span>Your balance:</span>
                                        <span>
                                            {user?.surplus?.toLocaleString()}
                                            &nbsp; VND
                                        </span>
                                    </div>
                                    <div
                                        className={cx('tuition__payment--item')}
                                    >
                                        <span>Semester Tuition:</span>
                                        <span>
                                            {tuition?.tuition_fee?.toLocaleString() ||
                                                0}
                                            &nbsp; VND
                                        </span>
                                    </div>

                                    <div
                                        className={cx('tuition__payment--item')}
                                    >
                                        <span>Reduction:</span> 0
                                    </div>

                                    <hr />

                                    <div
                                        className={cx(
                                            'tuition__payment--item',
                                            'total__tuition'
                                        )}
                                    >
                                        <span>Total tuition unpaid:</span>
                                        {tuition?.tuition_status === 0
                                            ? tuition?.tuition_fee?.toLocaleString()
                                            : 0}
                                        &nbsp;VND
                                    </div>
                                </div>
                            </div>

                            {tuition?.tuition_status === 0 && (
                                <div className={cx('btn__submit')}>
                                    <button onClick={handleOpenModal}>
                                        Pay tuition
                                    </button>
                                </div>
                            )}

                            {openModal && (
                                <Modal
                                    title={'Confirm payment'}
                                    showModal={handleOpenModal}
                                    setShowModal={handleCloseModal}
                                >
                                    <div className={cx('modal')}>
                                        <div className={cx('modal__container')}>
                                            <div className={cx('title')}>
                                                Tuition fee brief:
                                            </div>
                                            <div
                                                className={cx('modal__content')}
                                            >
                                                <p>
                                                    StudentID: &nbsp;
                                                    {tuition?.student_id}
                                                </p>
                                                <hr />
                                                <p>
                                                    Fullname: &nbsp;
                                                    {tuition?.full_name}
                                                </p>

                                                <hr />
                                                <p>
                                                    Tuition: &nbsp;
                                                    {tuition?.tuition_fee?.toLocaleString()}
                                                    &nbsp;VND
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className={cx('modal__footer')}>
                                                Make sure you have fully checked
                                                the payer information and the
                                                tuition fee information. &nbsp;
                                                <span>
                                                    We will not be responsible
                                                    for any omissible fees.
                                                </span>
                                            </p>

                                            <div
                                                className={cx('modal__action')}
                                            >
                                                <button
                                                    className={cx('btn-cancel')}
                                                    onClick={handleCloseModal}
                                                >
                                                    Close
                                                </button>

                                                <div
                                                    className={cx(
                                                        'modal__action-confirm'
                                                    )}
                                                >
                                                    {loadingModal ? (
                                                        <LoadingIcon />
                                                    ) : (
                                                        <button
                                                            className={cx(
                                                                'btn__submit'
                                                            )}
                                                            onClick={
                                                                handleClickSubmitTuition
                                                            }
                                                            disabled={
                                                                loadingModal
                                                            }
                                                        >
                                                            Confirm
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Home;
