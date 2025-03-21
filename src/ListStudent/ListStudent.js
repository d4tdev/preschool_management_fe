/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../API/CallApi';
import ListSV from './Components/ShowList';
import ExportToExcel from './Components/ExportData';

class ListStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            lop: [], // Khởi tạo rỗng, sẽ lấy từ API hoặc localStorage
            item: localStorage.getItem('item') || '', // Lớp được chọn
            className: localStorage.getItem('className') || '', // Tên lớp hiển thị
        };
        CallApi(
            `auth/list-user?filters[role]=parent&filters[teacher_id]=${localStorage.getItem(
                'user'
            )}`,
            'GET',
            null
        ).then((res) => {
            if (res?.data?.data != null) {
                localStorage.setItem(
                    'parents',
                    JSON.stringify(res?.data?.data)
                );
            }
        });
    }

    componentDidMount() {
        // Lấy danh sách lớp từ localStorage hoặc API
        const storedLop = localStorage.getItem('lop');
        if (storedLop) {
            try {
                const parsedLop = JSON.parse(storedLop);
                this.setState({ lop: parsedLop }, () => {
                    // Nếu đã có item trong localStorage, lấy học sinh theo lớp đó
                    if (this.state.item) {
                        const selectedClass = parsedLop.find(
                            (item) => item.id === this.state.item
                        );
                        if (selectedClass) {
                            this.setState({ className: selectedClass.name });
                            this.fetchStudents(this.state.item);
                        }
                    } else {
                        this.fetchStudents(); // Lấy tất cả học sinh nếu không có lớp được chọn
                    }
                });
            } catch (error) {
                console.error('Error parsing lop from localStorage:', error);
                this.setState({ lop: [] });
            }
        } else {
            // Nếu không có dữ liệu trong localStorage, có thể gọi API để lấy danh sách lớp
            this.fetchClasses();
        }
    }

    fetchClasses = () => {
        // Gọi API để lấy danh sách lớp nếu cần
        CallApi('class', 'GET', null)
            .then((res) => {
                if (res?.data?.data != null) {
                    const classes = res.data.data;
                    localStorage.setItem('lop', JSON.stringify(classes));
                    this.setState({ lop: classes }, () => {
                        if (this.state.item) {
                            const selectedClass = classes.find(
                                (item) => item.id === this.state.item
                            );
                            if (selectedClass) {
                                this.setState({
                                    className: selectedClass.name,
                                });
                                this.fetchStudents(this.state.item);
                            }
                        }
                    });
                } else {
                    this.setState({ lop: [] });
                }
            })
            .catch((err) => {
                console.error('Error fetching classes:', err);
                this.setState({ lop: [] });
            });
    };

    fetchStudents = (classId) => {
        const url = classId
            ? `student?filters[class_id]=${classId}`
            : `student`;
        CallApi(url, 'GET', null)
            .then((res) => {
                if (res?.data?.data != null) {
                    this.setState({
                        students: res.data.data,
                    });
                } else {
                    this.setState({
                        students: [],
                    });
                }
            })
            .catch((err) => {
                console.error('Error fetching students:', err);
                this.setState({ students: [] });
            });
    };

    ChooseClass = (event) => {
        const classId = event.target.value;
        const selectedClass = this.state.lop.find((item) => item.id == classId);
        if (selectedClass) {
            const { id, name } = selectedClass;
            localStorage.setItem('item', id);
            localStorage.setItem('className', name);
            this.setState({ item: id, className: name }, () => {
                this.fetchStudents(id); // Lấy học sinh theo lớp được chọn
            });
        } else {
            // Nếu không chọn lớp (chọn "-- Chọn lớp --"), lấy tất cả học sinh
            localStorage.removeItem('item');
            localStorage.removeItem('className');
            this.setState({ item: '', className: '' }, () => {
                this.fetchStudents();
            });
        }
    };

    findIndex = (_id) => {
        const { students } = this.state;
        return students.findIndex((student) => student._id === _id);
    };

    onDelete = (_id) => {
        const { students } = this.state;
        CallApi(`student/${_id}`, 'DELETE', null)
            .then((res) => {
                if (res.status === 200) {
                    const index = this.findIndex(_id);
                    if (index !== -1) {
                        students.splice(index, 1);
                        this.setState({ students: [...students] });
                        console.log(`Deleted student with _id: ${_id}`);
                    }
                } else {
                    console.error('Delete failed:', res);
                    alert('Xóa trẻ thất bại');
                }
            })
            .catch((err) => {
                console.error('Error deleting student:', err);
                alert('Xóa trẻ thất bại');
            });
    };

    render() {
        const { students, lop, className, item } = this.state;

        return (
            <div className='min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-8'>
                {/* Tiêu đề */}
                <div className='text-center mb-12'>
                    <h1 className='text-6xl font-bold text-gray-800'>
                        Quản lý trẻ
                    </h1>
                </div>

                {/* Nội dung chính */}
                <div className='max-w-full mx-auto'>
                    <div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
                        {/* Dropdown chọn lớp */}
                        {localStorage.getItem('role') === 'admin' ? (
                            <div className='flex items-center gap-4'>
                                <label className='mb-0 text-2xl font-medium text-gray-700'>
                                    Lớp:
                                </label>
                                <select
                                    value={item}
                                    onChange={this.ChooseClass}
                                    className='p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl w-full sm:w-auto'>
                                    <option value=''>-- Chọn lớp --</option>
                                    {lop.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className='flex items-center gap-4'>
                                <label className='mb-0 text-2xl font-medium text-gray-700'>
                                    Lớp:
                                </label>
                                <span className='text-2xl text-gray-600'>
                                    {className || 'Tất cả lớp'}
                                </span>
                            </div>
                        )}

                        {/* Các nút hành động */}
                        {localStorage.getItem('role') === 'parent' ? null : (
                            <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center'>
                                <Link
                                    to='/home/list-students/add'
                                    className='bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition flex items-center gap-2 w-full sm:w-auto justify-center'>
                                    <span className='fa fa-plus'></span> Thêm
                                    học sinh
                                </Link>
                                <button
                                    className='bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition flex items-center gap-2 w-full sm:w-auto justify-center'
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                'export-excel-button'
                                            )
                                            ?.click()
                                    }>
                                    <span className='fa fa-file-export'></span>{' '}
                                    Export to Excel
                                    <div className='hidden'>
                                        <ExportToExcel
                                            apiData={students}
                                            fileName={item || 'Students'}
                                            id='export-excel-button'
                                        />
                                    </div>
                                </button>
                                <Link
                                    to='/home/list-students/import-data'
                                    className='bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition flex items-center gap-2 w-full sm:w-auto justify-center'>
                                    <span className='fa fa-file-import'></span>{' '}
                                    Nhập dữ liệu từ Excel
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Danh sách học sinh */}
                    <div className='bg-white p-6 rounded-lg shadow-lg'>
                        <ListSV students={students} onDelete={this.onDelete} />
                    </div>
                </div>
            </div>
        );
    }
}

export default ListStudent;
