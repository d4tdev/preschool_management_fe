/* eslint-disable no-restricted-globals */
/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

class OneRowData extends Component {
    onDelete = (_id, msv) => {
        if (confirm('Bạn chắc chắn muốn xóa lớp học này ?')) {
            this.props.onDelete(_id, msv);
        }
    };

    render() {
        var { situation, index } = this.props;
        return (
            <tr height='30px'>
                <td className='text_center'>{index + 1}</td>
                <td className='text_center'>
                    {situation.day == 'morning' ? 'Sáng' : 'Chiều'}
                </td>
                <td className='text_center'>
                    {moment(situation.created_at).format('DD/MM/YYYY')}
                </td>
                <td className='text_center'>
                    {situation.review == 'good' ? 'Ngoan' : 'Chưa ngoan'}
                </td>
                <td className='text_center'>
                    <Link
                        to={`/home/list-situations/update/${situation.id}`}
                        className='btn btn-warning'>
                        <span className='fa fa-info'></span> &nbsp;Thông tin chi
                        tiết
                    </Link>{' '}
                    &nbsp;
                </td>
            </tr>
        );
    }
}

export default OneRowData;
