/* eslint-disable no-restricted-globals */
/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

class OneRowData extends Component {
    onDelete = (id) => {
        if (confirm('Bạn chắc chắn muốn xóa bữa ăn này?')) {
            this.props.onDelete(id); // Chỉ truyền id
        }
    };

    render() {
        const { meal, index } = this.props;
        return (
            <tr height='30px'>
                <td className='text_center'>{index + 1}</td>
                <td className='text_center'>{meal.name}</td>
                <td className='text_center'>
                    {meal.created_at
                        ? moment(meal.created_at).format('DD/MM/YYYY')
                        : '-'}
                </td>
                <td className='text_center'>
                    {meal.updated_at
                        ? moment(meal.updated_at).format('DD/MM/YYYY')
                        : '-'}
                </td>
                <td className='text_center'>
                    <Link
                        to={`/home/list-meals/update/${meal.id}`} // Đổi thành đường dẫn xem chi tiết
                        className='btn btn-warning'>
                        <span className='fa fa-info'></span>   Chi tiết
                    </Link>{' '}
                    <button
                        className='btn btn-danger'
                        type='button'
                        onClick={() => this.onDelete(meal.id)}>
                        <span className='fa fa-trash'></span>   Xóa
                    </button>{' '}
                </td>
            </tr>
        );
    }
}

export default OneRowData;
