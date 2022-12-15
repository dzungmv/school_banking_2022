import { toast } from 'react-toastify';
import classNames from 'classnames/bind';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

import { Login, refreshToken } from '@/api/userApi';
import { login } from '@/_redux/features/user/userSlice';

import styles from './SignIn.module.scss';
import Loading from '@/layouts/DefaultLayout/Loading';
import logo from '@/assets/images/logo.png';
import tip_image from '@/assets/images/tip.png';
import login_img from '@/assets/images/login.png';
import Modal from '@/layouts/DefaultLayout/Modal';
import error_img from '@/assets/images/error.png';
import useEnterKeyListener from '@/hooks/useEnterKeyListener';

const cx = classNames.bind(styles);

function SignIn() {
    useEffect(() => {
        document.title = 'Login';
    }, []);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);

    useEnterKeyListener({
        querySelectorToExecuteClick: '#submitLoginBtn',
    });

    const handleSubmit = async () => {
        if (!username) {
            toast.error('Please enter username!');
            userInputRef.current.focus();
            return;
        }

        if (!password) {
            toast.error('Please enter password!');
            passwordInputRef.current.focus();
            return;
        }

        setLoading(true);

        let res = await Login(username, password);

        if (res === null) {
            setModal(true);
            setLoading(false);
            return;
        }

        if (res.status === 401) {
            res = await refreshToken();
            res = await Login(username, password);
        }

        if (res.data.error) {
            toast.error('Invalid username or password!');
            setLoading(false);
            return;
        }

        dispatch(login(res.data));
        setLoading(false);
        navigate('/');
        toast.success('Login successfully!');
    };

    return (
        <>
            <Modal
                title={'Opps! Some thing went wrong!'}
                showModal={modal}
                setShowModal={() => setModal(false)}
            >
                <div className={cx('modal__container')}>
                    Maybe your device is not connected to the internet or
                    <a href='https://www.termsfeed.com/blog/privacy-policy-url/'>
                        {' '}
                        privacy policy https
                    </a>
                    . If you want to try accessing the system, please go to the
                    link below:
                    <br />
                    <a
                        href='https://13.215.191.9'
                        target='_blank'
                        rel='noreferrer'
                    >
                        https://midterm.fix-network.com
                    </a>
                    <div>
                        Step: 1. Click on the link above
                        <br />
                        Step: 2. Click on the "Advanced" button
                        <br />
                        Step: 3. Click on the "Process to
                        https://13.215.191.9(unsafe)"
                        <br />
                        Step 4. Comeback to this page and try again
                    </div>
                    <img src={error_img} alt='' />
                </div>
            </Modal>
            {loading && <Loading />}
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('image')}>
                        <div className={cx('image__action')}>
                            <img src={login_img} alt='login' />
                        </div>
                        <div className={cx('logo')}>
                            <img src={logo} alt='' />
                        </div>
                    </div>
                    <div className={cx('form')}>
                        <div className={cx('form__container')}>
                            <h3 className={cx('form__title')}>Sign in</h3>
                            <div className={cx('logo')}>
                                <div>
                                    <img src={logo} alt='' />
                                </div>
                            </div>

                            <input
                                type={'text'}
                                value={username}
                                ref={userInputRef}
                                placeholder={'Email'}
                                className={cx('form-control')}
                                onChange={(e) =>
                                    setUsername(e.target.value.trim())
                                }
                            />

                            <input
                                value={password}
                                type={'password'}
                                ref={passwordInputRef}
                                placeholder={'Password'}
                                className={cx('form-control')}
                                onChange={(e) =>
                                    setPassword(e.target.value.trim())
                                }
                            />

                            <button
                                id={'submitLoginBtn'}
                                onClick={handleSubmit}
                                className={cx('form-control', 'form-btn')}
                                disabled={loading}
                            >
                                Sign in
                            </button>

                            <div className={cx('footer')}>
                                <div className={cx('tip')}>
                                    <img src={tip_image} alt='' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignIn;
