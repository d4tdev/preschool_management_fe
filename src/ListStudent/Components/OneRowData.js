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
        var { student, index } = this.props;
        return (
            <tr height='30px'>
                <td className='text_center'>{index + 1}</td>
                <td className='text_center'>{student.name}</td>
                <td className='text_center'>
                    {moment(student.birthday).format('DD/MM/YYYY')}
                </td>
                <td className='text_center'>{student.gender}</td>
                <td className='text_center'>{student.parent_id.name}</td>
                <td className='text_center'>{student.class_id.name}</td>
                <td className='text_center'>
                    <Link
                        to={`/home/list-students/update/${student.id}`}
                        className='btn btn-warning'>
                        <span className='fa fa-info'></span> &nbsp;Chi tiết
                    </Link>{' '}
                    &nbsp;
                    <button
                        className='btn btn-danger'
                        type='button'
                        onClick={() => this.onDelete(student.id, student.msv)}>
                        <span className='fa fa-trash'></span> &nbsp;Xóa
                    </button>{' '}
                    &nbsp;
                </td>
            </tr>
        );
    }
}

export default OneRowData;
