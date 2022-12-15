import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import { useSelector } from 'react-redux';

import styles from './Header.module.scss';
import Tooltip from './Tooltip';
import logo from '@/assets/images/logo.png';

const cx = classNames.bind(styles);

function Header() {
    const headerRef = useRef(null);

    const user = useSelector((state) => state.user.user);

    const money = user?.surplus?.toLocaleString();

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <Link to={'/'}>
                    <div className={cx('logo')}>
                        <img src={logo} alt='' />
                        <h3>Ton Duc Thang University</h3>
                    </div>
                </Link>

                <div className={cx('action')}>
                    <div className={cx('action__hello')}>
                        {user?.fullname}&nbsp;({money} VND)
                    </div>
                    <Tippy
                        ref={headerRef}
                        content={<Tooltip headerRef={headerRef} />}
                        arrow={false}
                        interactive
                        placement='bottom-start'
                        theme='light'
                        trigger={'click'}
                    >
                        <div className={cx('action__avatar')}>
                            <img src={logo} alt='' />
                        </div>
                    </Tippy>
                </div>
            </div>
        </div>
    );
}

export default Header;
