import { useRef, useCallback, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import classNames from 'classnames/bind';

import styles from './Modal.module.scss';

const cx = classNames.bind(styles);

function Modal({ title, children, showModal, setShowModal }) {
    const modalRef = useRef();

    const animation = useSpring({
        config: {
            duration: 250,
        },
        opacity: showModal ? 1 : 0,
        transform: showModal ? `translateY(0%)` : `translateY(-100%)`,
    });

    const keyProp = useCallback(
        (e) => {
            if (e.key === 'Escape' && showModal) {
                setShowModal(false);
            }
        },
        [setShowModal, showModal]
    );

    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            setShowModal(false);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', keyProp);
        return () => document.removeEventListener('keydown', keyProp);
    });

    return (
        <>
            {showModal ? (
                <div
                    className={cx('wrapper')}
                    ref={modalRef}
                    onClick={closeModal}
                >
                    <animated.div style={animation}>
                        <div className={cx('container')}>
                            <div className={cx('heading')}>
                                <div className={cx('title')}>{title}</div>
                                <span
                                    className={cx('close')}
                                    onClick={() => setShowModal(false)}
                                >
                                    <li
                                        className={cx('fa-light', 'fa-xmark')}
                                    ></li>
                                </span>
                            </div>
                            <div className={cx('content')}>{children}</div>
                        </div>
                    </animated.div>
                </div>
            ) : null}
        </>
    );
}

export default Modal;
