/* eslint-disable no-restricted-globals */
/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

class OneRowData extends Component {
    render() {
        var { attendance, index } = this.props;
        return (
            <tr height='30px'>
                <td className='text_center'>{index + 1}</td>
                <td className='text_center'>
                    {moment(attendance.date).format('DD/MM/YYYY')}
                </td>
                <td className='text_center'>
                    {attendance.status == 'arrived' ? 'Đã đến' : 'Đã về'}
                </td>
                <td className='text_center'>
                    {attendance.arrived_at
                        ? moment(attendance.arrived_at).format('HH:mm')
                        : 'Chưa đến'}
                </td>
                <td className='text_center'>
                    {attendance.left_at
                        ? moment(attendance.left_at).format('HH:mm')
                        : 'Chưa về'}
                </td>
            </tr>
        );
    }
}

export default OneRowData;
