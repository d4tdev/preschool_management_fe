/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../../API/CallApi';
import moment from 'moment';
import '../../index.css';
import bg_link from './avatar.png';
import styled from 'styled-components';

const Body = styled.div`
    position: relative;
    overflow: hidden;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: url('https://i.pinimg.com/originals/d0/37/3c/d0373ccf3e773b74ed82648e765cca67.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3); /* Lớp phủ mờ */
        z-index: 1;
    }
    > * {
        position: relative;
        z-index: 2;
    }
`;

class InfoStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: [],
            first_name: '',
            last_name: '',
            id: '',
            name: '',
            birthday: '',
            gender: '',
            parent: '', // Hiển thị name của parent
            parent_id: '', // Lưu id để gửi API
            class: '', // Hiển thị name của class
            class_id: '', // Lưu id để gửi API
        };
    }

    componentDidMount() {
        const { match } = this.props;
        if (match) {
            const id = match.params.id;
            CallApi(`student/${id}`, 'GET', null).then((res) => {
                const data = res?.data?.data;
                console.log(data);
                this.setState({
                    student: data,
                    id: data.id,
                    name: data.name,
                    birthday: data.birthday,
                    gender: data.gender,
                    parent: data.parent_id.name,
                    parent_id: data.parent_id.id,
                    class: data.class_id.name,
                    class_id: data.class_id.id,
                    first_name: data.first_name,
                    last_name: data.last_name,
                });
            });
        }
    }

    onChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value; // value là id từ option

        const parents = JSON.parse(localStorage.getItem('parents')) || [];
        const classes = JSON.parse(localStorage.getItem('lop')) || [];

        if (name === 'parent') {
            const selectedParent = parents.find((p) => p.id == value);
            this.setState({
                parent: selectedParent
                    ? selectedParent.name
                    : this.state.parent,
                parent_id: +value,
            });
        } else if (name === 'class') {
            const selectedClass = classes.find((c) => c.id == value);
            this.setState({
                class: selectedClass ? selectedClass.name : this.state.class,
                class_id: +value,
            });
        } else {
            this.setState({
                [name]: value,
            });
        }
    };

    onSubmit = (event) => {
        event.preventDefault();
        const id = this.props.match.params.id;
        CallApi(`student/${id}`, 'PUT', {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            birthday: this.state.birthday,
            gender: this.state.gender,
            parent_id: this.state.parent_id, // Gửi id
            class_id: this.state.class_id, // Gửi id
        })
            .then((res) => {
                alert('Cập nhật thành công');
            })
            .catch((err) => {
                console.error('Error updating student:', err);
                alert('Cập nhật thất bại');
            });
    };

    render() {
        const { student, parent, class: className } = this.state;

        const parents = JSON.parse(localStorage.getItem('parents')) || [];
        const classes = JSON.parse(localStorage.getItem('lop')) || [];

        return (
            <Body>
                {/* Tiêu đề chính */}
                <h2 className='text-6xl font-bold text-white text-center mb-12 text-shadow-lg'>
                    Thông tin chi tiết
                </h2>

                {/* Form thông tin */}
                <div className='bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl'>
                    <h3 className='text-4xl font-bold text-center text-gray-800 mb-8'>
                        Thông tin cá nhân
                    </h3>

                    <div className='flex flex-col md:flex-row items-center md:items-start gap-8'>
                        {/* Ảnh đại diện */}
                        <div className='flex-shrink-0'>
                            <img
                                className='avatar'
                                src={bg_link}
                                width='180px'
                                height='180px'
                            />
                        </div>

                        {/* Thông tin bên trái */}
                        <div className='flex-1'>
                            <div className='mb-6'>
                                <label className='block text-2xl font-medium text-gray-700 mb-2'>
                                    Họ:
                                </label>
                                <input
                                    type='text'
                                    name='first_name'
                                    placeholder={student.first_name}
                                    onChange={this.onChange}
                                    className='w-full p-3 border rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                            </div>

                            <div className='mb-6'>
                                <label className='block text-2xl font-medium text-gray-700 mb-2'>
                                    Tên:
                                </label>
                                <input
                                    type='text'
                                    name='last_name'
                                    placeholder={student.last_name}
                                    onChange={this.onChange}
                                    className='w-full p-3 border rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                            </div>

                            <div className='mb-6'>
                                <label className='block text-2xl font-medium text-gray-700 mb-2'>
                                    Ngày sinh:
                                </label>
                                <input
                                    type='text'
                                    name='birthday'
                                    placeholder={moment(
                                        student.birthday
                                    ).format('DD/MM/YYYY')}
                                    onChange={this.onChange}
                                    className='w-full p-3 border rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                            </div>

                            <div className='mb-6'>
                                <label className='block text-2xl font-medium text-gray-700 mb-2'>
                                    Giới tính:
                                </label>
                                <input
                                    type='text'
                                    name='gender'
                                    placeholder={student.gender}
                                    onChange={this.onChange}
                                    className='w-full p-3 border rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                            </div>
                        </div>

                        {/* Thông tin bên phải */}
                        <div className='flex-1'>
                            <div className='mb-6'>
                                <label className='block text-2xl font-medium text-gray-700 mb-2'>
                                    Phụ huynh:
                                </label>
                                <select
                                    name='parent'
                                    required
                                    value={this.state.parent_id}
                                    onChange={this.onChange}
                                    className='w-full p-3 border rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                    <option value='' disabled hidden>
                                        {parent || 'Chọn phụ huynh'}
                                    </option>
                                    {parents.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='mb-6'>
                                <label className='block text-2xl font-medium text-gray-700 mb-2'>
                                    Lớp:
                                </label>
                                <select
                                    name='class'
                                    required
                                    value={this.state.class_id}
                                    onChange={this.onChange}
                                    className='w-full p-3 border rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                    <option value='' disabled hidden>
                                        {className || 'Chọn lớp'}
                                    </option>
                                    {classes.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nút điều hướng */}
                <div className='mt-10 flex gap-6'>
                    <Link
                        to='/home/list-students'
                        className='flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-md text-xl hover:bg-red-700 transition'>
                        <span className='fa fa-arrow-left'></span> Quay lại
                    </Link>
                    <button
                        type='submit'
                        onClick={this.onSubmit}
                        className='flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md text-xl hover:bg-blue-700 hover:text-white transition'>
                        <span className='fa fa-save'></span> Ghi nhận
                    </button>
                </div>
            </Body>
        );
    }
}

export default InfoStudent;
