/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../../API/CallApi';

class AddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            teacher: '',
            teachers: [], // Lưu danh sách giáo viên từ localStorage
            error: null, // Lưu lỗi nếu có
        };
    }

    componentDidMount() {
        // Lấy danh sách giáo viên từ localStorage
        const storedTeachers = localStorage.getItem('teachers');
        if (storedTeachers) {
            try {
                const parsedTeachers = JSON.parse(storedTeachers);
                this.setState({ teachers: parsedTeachers });
            } catch (error) {
                console.error(
                    'Error parsing teachers from localStorage:',
                    error
                );
                this.setState({ teachers: [] });
            }
        } else {
            // Nếu không có dữ liệu trong localStorage, có thể gọi API để lấy danh sách giáo viên
            this.fetchTeachers();
        }
    }

    fetchTeachers = () => {
        CallApi('auth/list-user?filters[role]=teacher', 'GET', null)
            .then((res) => {
                if (res?.data?.data != null) {
                    const teachers = res.data.data;
                    localStorage.setItem('teachers', JSON.stringify(teachers));
                    this.setState({ teachers });
                } else {
                    this.setState({ teachers: [] });
                }
            })
            .catch((err) => {
                console.error('Error fetching teachers:', err);
                this.setState({ teachers: [] });
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

        const { name, teacher } = this.state;

        // Validation cơ bản
        if (!name || !teacher || teacher === '--Select--') {
            this.setState({ error: 'Vui lòng điền đầy đủ thông tin.' });
            return;
        }

        // Gọi API để thêm lớp học
        CallApi('classroom', 'POST', {
            name: name,
            teacher_id: teacher,
        })
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    this.setState({
                        name: '',
                        teacher: '',
                        error: null,
                    });
                    alert('Đã thêm lớp học thành công!');
                    // Có thể chuyển hướng về danh sách lớp học nếu cần
                    // this.props.history.push('/home/list-classrooms');
                } else {
                    this.setState({
                        error: 'Thêm lớp học thất bại. Vui lòng thử lại.',
                    });
                }
            })
            .catch((err) => {
                console.error('Error adding classroom:', err);
                this.setState({
                    error: 'Thêm lớp học thất bại. Vui lòng thử lại.',
                });
            });
    };

    render() {
        const { name, teacher, teachers, error } = this.state;

        return (
            <div className='min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-8'>
                {/* Nút Quay lại */}
                <div className='mb-6'>
                    <Link
                        to='/home/list-classrooms'
                        className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition flex items-center gap-2 w-fit'>
                        <span className='fa fa-arrow-left'></span> Quay lại
                    </Link>
                </div>

                {/* Form thêm lớp học */}
                <div className='max-w-2xl mx-auto bg-white p-10 rounded-lg shadow-lg'>
                    <h3 className='text-4xl font-bold text-gray-800 mb-10 text-center'>
                        Thêm lớp học
                    </h3>

                    {error && (
                        <div className='mb-8 p-4 bg-red-100 text-red-700 rounded-md text-center text-xl'>
                            {error}
                        </div>
                    )}

                    <form onSubmit={this.onSubmit}>
                        <div className='mb-8'>
                            <label className='block text-2xl font-medium text-gray-700 mb-3 hover:text-gray-900 transition'>
                                Tên lớp học:
                            </label>
                            <input
                                type='text'
                                className='w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl hover:border-blue-500 transition'
                                name='name'
                                value={name}
                                onChange={this.onChange}
                                placeholder='Nhập tên lớp học'
                                required
                            />
                        </div>

                        <div className='mb-10'>
                            <label className='block text-2xl font-medium text-gray-700 mb-3 hover:text-gray-900 transition'>
                                Giáo viên:
                            </label>
                            <select
                                className='w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl hover:border-blue-500 transition'
                                name='teacher'
                                value={teacher}
                                onChange={this.onChange}
                                required>
                                <option value='--Select--'>
                                    -- Chọn giáo viên --
                                </option>
                                {teachers.map((item) => (
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
                                to='/home/list-classrooms'
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
