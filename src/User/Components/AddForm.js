/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../../API/CallApi';

class AddUserForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            role: '',
            password: '',
            error: null, // Lưu lỗi nếu có
        };
    }

    onChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
            error: null, // Xóa lỗi khi người dùng thay đổi input
        });
    };

    onSubmit = (event) => {
        event.preventDefault();

        const { first_name, last_name, email, phone, role, password } =
            this.state;

        // Validation cơ bản
        if (
            !first_name ||
            !last_name ||
            !email ||
            !phone ||
            !role ||
            role === '--Select--' ||
            !password
        ) {
            this.setState({ error: 'Vui lòng điền đầy đủ thông tin.' });
            return;
        }

        // Gọi API để thêm người dùng
        CallApi('auth/register', 'POST', {
            first_name,
            last_name,
            email,
            phone,
            role,
            password,
        })
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    this.setState({
                        first_name: '',
                        last_name: '',
                        email: '',
                        phone: '',
                        role: '',
                        password: '',
                        error: null,
                    });
                    alert('Đã thêm người dùng thành công!');
                    // Có thể chuyển hướng về danh sách người dùng nếu cần
                    // this.props.history.push('/home/list-users');
                } else {
                    this.setState({
                        error: 'Thêm người dùng thất bại. Vui lòng thử lại.',
                    });
                }
            })
            .catch((err) => {
                console.error('Error adding user:', err);
                this.setState({
                    error: 'Thêm người dùng thất bại. Vui lòng thử lại.',
                });
            });
    };

    render() {
        const { first_name, last_name, email, phone, role, password, error } =
            this.state;

        return (
            <div className='min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-8'>
                {/* Nút Quay lại */}
                <div className='mb-6'>
                    <Link
                        to='/home/list-users' // Cập nhật đường dẫn về danh sách người dùng
                        className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition flex items-center gap-2 w-fit'>
                        <span className='fa fa-arrow-left'></span> Quay lại
                    </Link>
                </div>

                {/* Form thêm người dùng */}
                <div className='max-w-2xl mx-auto bg-white p-10 rounded-lg shadow-lg'>
                    <h3 className='text-4xl font-bold text-gray-800 mb-10 text-center'>
                        Thêm người dùng
                    </h3>

                    {error && (
                        <div className='mb-8 p-4 bg-red-100 text-red-700 rounded-md text-center text-xl'>
                            {error}
                        </div>
                    )}

                    <form onSubmit={this.onSubmit}>
                        <div className='mb-8'>
                            <label className='block text-2xl font-medium text-gray-700 mb-3 hover:text-gray-900 transition'>
                                Họ:
                            </label>
                            <input
                                type='text'
                                className='w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl hover:border-blue-500 transition'
                                name='first_name'
                                value={first_name}
                                onChange={this.onChange}
                                placeholder='Nhập họ của người dùng'
                                required
                            />
                        </div>

                        <div className='mb-8'>
                            <label className='block text-2xl font-medium text-gray-700 mb-3 hover:text-gray-900 transition'>
                                Tên:
                            </label>
                            <input
                                type='text'
                                className='w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl hover:border-blue-500 transition'
                                name='last_name'
                                value={last_name}
                                onChange={this.onChange}
                                placeholder='Nhập tên của người dùng'
                                required
                            />
                        </div>

                        <div className='mb-8'>
                            <label className='block text-2xl font-medium text-gray-700 mb-3 hover:text-gray-900 transition'>
                                Email:
                            </label>
                            <input
                                type='email'
                                className='w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl hover:border-blue-500 transition'
                                name='email'
                                value={email}
                                onChange={this.onChange}
                                placeholder='Nhập email của người dùng'
                                required
                            />
                        </div>

                        <div className='mb-8'>
                            <label className='block text-2xl font-medium text-gray-700 mb-3 hover:text-gray-900 transition'>
                                Số điện thoại:
                            </label>
                            <input
                                type='text'
                                className='w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl hover:border-blue-500 transition'
                                name='phone'
                                value={phone}
                                onChange={this.onChange}
                                placeholder='Nhập số điện thoại'
                                required
                            />
                        </div>

                        <div className='mb-8'>
                            <label className='block text-2xl font-medium text-gray-700 mb-3 hover:text-gray-900 transition'>
                                Vai trò:
                            </label>
                            <select
                                className='w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl hover:border-blue-500 transition'
                                name='role'
                                value={role}
                                onChange={this.onChange}
                                required>
                                <option value='--Select--'>
                                    -- Chọn vai trò --
                                </option>
                                <option value='admin'>Quản trị viên</option>
                                <option value='teacher'>Giáo viên</option>
                                <option value='parent'>Phụ huynh</option>
                            </select>
                        </div>

                        <div className='mb-10'>
                            <label className='block text-2xl font-medium text-gray-700 mb-3 hover:text-gray-900 transition'>
                                Mật khẩu:
                            </label>
                            <input
                                type='password'
                                className='w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl hover:border-blue-500 transition'
                                name='password'
                                value={password}
                                onChange={this.onChange}
                                placeholder='Nhập mật khẩu'
                                required
                            />
                        </div>

                        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                            <button
                                type='submit'
                                className='bg-blue-600 text-white px-10 py-4 rounded-md hover:bg-blue-500 hover:text-white transition flex items-center gap-2 w-full sm:w-auto justify-center text-2xl'>
                                <span className='fa fa-plus'></span> Lưu lại
                            </button>
                            <Link
                                to='/home/list-users' // Cập nhật đường dẫn về danh sách người dùng
                                className='bg-gray-600 text-white px-10 py-4 rounded-md hover:bg-gray-500 hover:text-white transition flex items-center gap-2 w-full sm:w-auto justify-center text-2xl'>
                                <span className='fa fa-close'></span> Hủy bỏ
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default AddUserForm;
