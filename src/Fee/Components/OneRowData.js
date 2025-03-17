/* eslint-disable no-restricted-globals */
/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import CallApi from '../../API/CallApi';

class OneRowData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: this.props.fee.status, // Khởi tạo state từ props
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.fee.status !== this.props.fee.status) {
            this.setState({ status: this.props.fee.status });
        }
    }

    onToggleStatus = () => {
        const newStatus = this.state.status === 'done' ? 'not_yet' : 'done';
        this.setState({ status: newStatus }, () => {
            CallApi(`fee/${this.props.fee.id}`, 'PUT', {
                status: this.state.status,
            })
                .then((res) => {
                    if (res.status === 200) {
                        if (this.props.onUpdate) {
                            this.props.onUpdate(
                                this.props.fee.id,
                                this.state.status
                            );
                        }
                        alert('Cập nhật trạng thái thành công');
                    } else {
                        this.setState({ status: this.props.fee.status });
                        alert('Cập nhật trạng thái thất bại');
                    }
                })
                .catch((err) => {
                    console.error('Error updating status:', err);
                    this.setState({ status: this.props.fee.status });
                    alert('Cập nhật trạng thái thất bại');
                });
        });
    };

    render() {
        const { fee, index } = this.props;
        const { status } = this.state;

        const statusStyle = {
            padding: '10px 15px',
            borderRadius: '5px',
            color: 'white',
            cursor: 'pointer',
            textAlign: 'center',
            display: 'inline-block',
        };

        const doneStyle = {
            ...statusStyle,
            backgroundColor: '#a6da95', // Màu xanh cho "Đã nộp"
        };

        const notDoneStyle = {
            ...statusStyle,
            backgroundColor: '#d55d5d', // Màu đỏ cho "Chưa nộp"
        };

        return (
            <tr height='30px'>
                <td className='text_center'>{index + 1}</td>
                <td className='text_center'>{fee.student_id.name}</td>
                <td className='text_center'>
                    {moment(fee.fee_date).format('DD/MM/YYYY')}
                </td>
                <td className='text_center'>{fee.amount}</td>
                {localStorage.getItem('role') === 'parent' ? (
                    <td className='text_center'>
                        {status === 'done' ? (
                            <div style={doneStyle}>Đã nộp</div>
                        ) : (
                            <div style={notDoneStyle}>Chưa nộp</div>
                        )}
                    </td>
                ) : (
                    <td className='text_center'>
                        {status === 'done' ? (
                            <div
                                style={doneStyle}
                                onClick={this.onToggleStatus}>
                                Đã nộp
                            </div>
                        ) : (
                            <div
                                style={notDoneStyle}
                                onClick={this.onToggleStatus}>
                                Chưa nộp
                            </div>
                        )}
                    </td>
                )}
                <td className='text_center'>
                    {fee.description === '' ? 'Không có' : fee.description}
                </td>
            </tr>
        );
    }
}

export default OneRowData;
