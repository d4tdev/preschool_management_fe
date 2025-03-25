/* eslint-disable no-restricted-globals */
/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

class OneRowData extends Component {
    onDelete = (_id, msv) => {
        if (confirm('Bạn chắc chắn muốn xóa sinh viên này ?')) {
            this.props.onDelete(_id, msv);
        }
    };

    render() {
        var { user, index } = this.props;
        return (
            <tr height='30px'>
                <td className='text_center'>{index + 1}</td>
                <td className='text_center'>{user.name}</td>
                <td className='text_center'>{user.email}</td>
                <td className='text_center'>{user.phone}</td>
                <td className='text_center'>{user.role}</td>
                <td className='text_center'>
                    <button
                        className='btn btn-danger'
                        type='button'
                        onClick={() => this.onDelete(user.id, user?.msv)}>
                        <span className='fa fa-trash'></span> &nbsp;Xóa
                    </button>{' '}
                    &nbsp;
                </td>
            </tr>
        );
    }
}

export default OneRowData;
