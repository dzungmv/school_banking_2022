import classNames from 'classnames/bind';
import moment from 'moment';
import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';

import { useSelector } from 'react-redux';

import styles from './HistoryPayment.module.scss';

const cx = classNames.bind(styles);

function HistoryPayment() {
    const tuitionHistory = useSelector(
        (state) => state?.tuition?.tuition_history?.list
    );

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('heading-title')}>
                    Tuition payment history
                </div>
                <CTable hover>
                    <CTableHead>
                        <CTableRow color={'info'}>
                            <CTableHeaderCell scope='col'>#</CTableHeaderCell>
                            <CTableHeaderCell scope='col'>
                                Tuition fee
                            </CTableHeaderCell>
                            <CTableHeaderCell scope='col'>
                                Content
                            </CTableHeaderCell>
                            <CTableHeaderCell scope='col'>
                                Time
                            </CTableHeaderCell>
                            <CTableHeaderCell scope='col'>
                                History detail
                            </CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {tuitionHistory.map((data, index) => {
                            const timestamp = Math.floor(
                                new Date(data?.created_at).getTime() / 1000
                            );

                            return (
                                <CTableRow key={data?.id}>
                                    <CTableHeaderCell scope='row'>
                                        {index + 1}
                                    </CTableHeaderCell>
                                    <CTableDataCell>
                                        {data?.amount?.toLocaleString()} VND
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        {data?.content}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        {moment
                                            .unix(timestamp)
                                            .format('DD-MM-YYYY')}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        {moment.unix(timestamp).calendar()}
                                    </CTableDataCell>
                                </CTableRow>
                            );
                        })}
                    </CTableBody>
                </CTable>
            </div>
        </div>
    );
}

export default HistoryPayment;
