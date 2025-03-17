/* eslint-disable no-restricted-globals */
/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

class OneRowData extends Component {
    onDelete = (_id, msv) => {
        if (confirm('Bạn chắc chắn muốn xóa môn học này ?')) {
            this.props.onDelete(_id, msv);
        }
    };

    render() {
        var { subject, index } = this.props;
        return (
            <tr height='30px'>
                <td className='text_center'>{index + 1}</td>
                <td className='text_center'>{subject.name}</td>
                <td className='text_center'>
                    {moment(subject.created_at).format('DD/MM/YYYY')}
                </td>
                <td className='text_center'>
                    {moment(subject.updated_at).format('DD/MM/YYYY')}
                </td>
                <td className='text_center'>
                    <Link
                        to={`/home/list-subjects/update/${subject.id}`}
                        className='btn btn-warning'>
                        <span className='fa fa-info'></span> &nbsp;Chi tiết
                    </Link>{' '}
                    &nbsp;
                    <button
                        className='btn btn-danger'
                        type='button'
                        onClick={() => this.onDelete(subject._id, subject.msv)}>
                        <span className='fa fa-trash'></span> &nbsp;Xóa
                    </button>{' '}
                    &nbsp;
                </td>
            </tr>
        );
    }
}

export default OneRowData;
