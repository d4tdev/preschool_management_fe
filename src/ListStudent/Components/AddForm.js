/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../../API/CallApi';
import moment from 'moment';

class AddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            birthday: '',
            gender: '',
            class: '',
            parent: '',
            lop: [], // Lưu danh sách lớp từ localStorage
            parents: [], // Lưu danh sách phụ huynh từ localStorage
            error: null, // Lưu lỗi nếu có
        };
    }

    componentDidMount() {
        // Lấy danh sách lớp từ localStorage
        const storedLop = localStorage.getItem('lop');
        if (storedLop) {
            try {
                const parsedLop = JSON.parse(storedLop);
                this.setState({ lop: parsedLop });
            } catch (error) {
                console.error('Error parsing lop from localStorage:', error);
                this.setState({ lop: [] });
            }
        } else {
            // Nếu không có dữ liệu trong localStorage, có thể gọi API để lấy danh sách lớp
            this.fetchClasses();
        }

        // Lấy danh sách phụ huynh từ localStorage
        const storedParents = localStorage.getItem('parents');
        if (storedParents) {
            try {
                const parsedParents = JSON.parse(storedParents);
                this.setState({ parents: parsedParents });
            } catch (error) {
                console.error(
                    'Error parsing parents from localStorage:',
                    error
                );
                this.setState({ parents: [] });
            }
        } else {
            // Nếu không có dữ liệu trong localStorage, có thể gọi API để lấy danh sách phụ huynh
            this.fetchParents();
        }
    }

    fetchClasses = () => {
        CallApi('class', 'GET', null)
            .then((res) => {
                if (res?.data?.data != null) {
                    const classes = res.data.data;
                    localStorage.setItem('lop', JSON.stringify(classes));
                    this.setState({ lop: classes });
                } else {
                    this.setState({ lop: [] });
                }
            })
            .catch((err) => {
                console.error('Error fetching classes:', err);
                this.setState({ lop: [] });
            });
    };

    fetchParents = () => {
        CallApi(
            `auth/list-user?filters[role]=parent&filters[teacher_id]=${localStorage.getItem(
                'user'
            )}`,
            'GET',
            null
        )
            .then((res) => {
                if (res?.data?.data != null) {
                    const parents = res.data.data;
                    localStorage.setItem('parents', JSON.stringify(parents));
                    this.setState({ parents });
                } else {
                    this.setState({ parents: [] });
                }
            })
            .catch((err) => {
                console.error('Error fetching parents:', err);
                this.setState({ parents: [] });
            });
    };

    onChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
            error: null, // Xóa lỗi khi người dùng thay đổi input
        });
    };

    onSubmit = (event) => {
        event.preventDefault();

        const {
            first_name,
            last_name,
            birthday,
            gender,
            class: classId,
            parent,
        } = this.state;

        // Validation cơ bản
        if (
            !first_name ||
            !last_name ||
            !birthday ||
            !gender ||
            gender === '--Select--' ||
            !classId ||
            classId === '--Select--' ||
            !parent ||
            parent === '--Select--'
        ) {
            this.setState({ error: 'Vui lòng điền đầy đủ thông tin.' });
            return;
        }

        // Gọi API để thêm trẻ
        CallApi('student', 'POST', {
            first_name,
            last_name,
            birthday: moment(birthday).format('YYYY-MM-DD'),
            gender,
            parent_id: parent,
            class_id: classId,
        })
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    this.setState({
                        first_name: '',
                        last_name: '',
                        birthday: '',
                        gender: '',
                        class: '',
                        parent: '',
                        error: null,
                    });
                    alert('Đã thêm trẻ thành công!');
                    // Có thể chuyển hướng về danh sách trẻ nếu cần
                    // this.props.history.push('/home/list-students');
                } else {
                    this.setState({
                        error: 'Thêm trẻ thất bại. Vui lòng thử lại.',
                    });
                }
            })
            .catch((err) => {
                console.error('Error adding student:', err);
                this.setState({
                    error: 'Thêm trẻ thất bại. Vui lòng thử lại.',
                });
            });
    };

    render() {
        const {
            first_name,
            last_name,
            birthday,
            gender,
            class: classId,
            parent,
            lop,
            parents,
            error,
        } = this.state;

        return (
            <div className='min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-8'>
                {/* Nút Quay lại */}
                <div className='mb-6'>
                    <Link
                        to='/home/list-students'
                        className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition flex items-center gap-2 w-fit'>
                        <span className='fa fa-arrow-left'></span> Quay lại
                    </Link>
                </div>

                {/* Form thêm trẻ */}
                <div className='max-w-2xl mx-auto bg-white p-10 rounded-lg shadow-lg'>
                    <h3 className='text-4xl font-bold text-gray-800 mb-10 text-center'>
                        Thêm trẻ
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
                                placeholder='Nhập họ của trẻ'
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
                                placeholder='Nhập tên của trẻ'
                                required
                            />
                        </div>

                        <div className='mb-8'>
                            <label className='block text-2xl font-medium text-gray-700 mb-3 hover:text-gray-900 transition'>
                                Ngày sinh:
                            </label>
                            <input
                                type='date'
                                className='w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl hover:border-blue-500 transition'
                                name='birthday'
                                value={birthday}
                                onChange={this.onChange}
                                required
                            />
                        </div>

                        <div className='mb-8'>
                            <label className='block text-2xl font-medium text-gray-700 mb-3 hover:text-gray-900 transition'>
                                Giới tính:
                            </label>
                            <select
                                className='w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl hover:border-blue-500 transition'
                                name='gender'
                                value={gender}
                                onChange={this.onChange}
                                required>
                                <option value='--Select--'>
                                    -- Chọn giới tính --
                                </option>
                                <option value='Nam'>Nam</option>
                                <option value='Nữ'>Nữ</option>
                            </select>
                        </div>

                        <div className='mb-8'>
                            <label className='block text-2xl font-medium text-gray-700 mb-3 hover:text-gray-900 transition'>
                                Lớp:
                            </label>
                            <select
                                className='w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl hover:border-blue-500 transition'
                                name='class'
                                value={classId}
                                onChange={this.onChange}
                                required>
                                <option value='--Select--'>
                                    -- Chọn lớp --
                                </option>
                                {lop.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='mb-10'>
                            <label className='block text-2xl font-medium text-gray-700 mb-3 hover:text-gray-900 transition'>
                                Phụ huynh:
                            </label>
                            <select
                                className='w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl hover:border-blue-500 transition'
                                name='parent'
                                value={parent}
                                onChange={this.onChange}
                                required>
                                <option value='--Select--'>
                                    -- Chọn phụ huynh --
                                </option>
                                {parents.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                            <button
                                type='submit'
                                className='bg-blue-600 text-white px-10 py-4 rounded-md hover:bg-blue-500 hover:text-white transition flex items-center gap-2 w-full sm:w-auto justify-center text-2xl'>
                                <span className='fa fa-plus'></span> Lưu lại
                            </button>
                            <Link
                                to='/home/list-students'
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

export default AddForm;
