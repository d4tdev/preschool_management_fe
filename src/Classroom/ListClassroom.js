/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../API/CallApi';
import ListSV from './Components/ShowList';
import ExportToExcel from './Components/ExportData';

class ListClassroom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classrooms: [],
            lop: [], // Khởi tạo rỗng, sẽ lấy từ API hoặc localStorage
            item: localStorage.getItem('item') || '', // Lớp được chọn
            className: localStorage.getItem('className') || '', // Tên lớp hiển thị
        };
        CallApi('auth/list-user?filters[role]=teacher', 'GET', null).then(
            (res) => {
                if (res?.data?.data != null) {
                    localStorage.setItem(
                        'teachers',
                        JSON.stringify(res?.data?.data)
                    );
                }
            }
        );
    }

    componentDidMount() {
        // Lấy danh sách lớp từ localStorage hoặc API
        const storedLop = localStorage.getItem('lop');
        if (storedLop) {
            try {
                const parsedLop = JSON.parse(storedLop);
                this.setState({ lop: parsedLop }, () => {
                    // Nếu đã có item trong localStorage, lấy lớp học theo lớp đó
                    if (this.state.item) {
                        const selectedClass = parsedLop.find(
                            (item) => item.id === this.state.item
                        );
                        if (selectedClass) {
                            this.setState({ className: selectedClass.name });
                            this.fetchClassrooms(this.state.item);
                        }
                    } else {
                        this.fetchClassrooms(); // Lấy tất cả lớp học nếu không có lớp được chọn
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
                                this.fetchClassrooms(this.state.item);
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

    fetchClassrooms = (classId = '') => {
        // Giả định API hỗ trợ lọc lớp học theo classId, nếu không thì cần điều chỉnh logic
        const url = classId
            ? `classroom?filters[class_id]=${classId}`
            : `classroom`;
        CallApi(url, 'GET', null)
            .then((res) => {
                if (res?.data?.data != null) {
                    this.setState({
                        classrooms: res.data.data,
                    });
                } else {
                    this.setState({
                        classrooms: [],
                    });
                }
            })
            .catch((err) => {
                console.error('Error fetching classrooms:', err);
                this.setState({ classrooms: [] });
            });
    };

    ChooseClass = (event) => {
        const classId = event.target.value;
        const selectedClass = this.state.lop.find(
            (item) => item.id === classId
        );
        if (selectedClass) {
            const { id, name } = selectedClass;
            localStorage.setItem('item', id);
            localStorage.setItem('className', name);
            this.setState({ item: id, className: name }, () => {
                this.fetchClassrooms(id); // Lấy lớp học theo lớp được chọn
            });
        } else {
            // Nếu không chọn lớp (chọn "-- Chọn lớp --"), lấy tất cả lớp học
            localStorage.removeItem('item');
            localStorage.removeItem('className');
            this.setState({ item: '', className: '' }, () => {
                this.fetchClassrooms();
            });
        }
    };

    findIndex = (_id) => {
        const { classrooms } = this.state;
        return classrooms.findIndex((classroom) => classroom._id === _id);
    };

    onDelete = (_id) => {
        const { classrooms } = this.state;
        CallApi(`classroom/${_id}`, 'DELETE', null)
            .then((res) => {
                if (res.status === 200) {
                    const index = this.findIndex(_id);
                    if (index !== -1) {
                        classrooms.splice(index, 1);
                        this.setState({ classrooms: [...classrooms] });
                        console.log(`Deleted classroom with _id: ${_id}`);
                    }
                } else {
                    console.error('Delete failed:', res);
                    alert('Xóa lớp học thất bại');
                }
            })
            .catch((err) => {
                console.error('Error deleting classroom:', err);
                alert('Xóa lớp học thất bại');
            });
    };

    render() {
        const { classrooms, lop, className, item } = this.state;

        return (
            <div className='min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-8'>
                {/* Tiêu đề */}
                <div className='text-center mb-12'>
                    <h1 className='text-6xl font-bold text-gray-800'>
                        Quản lý lớp học
                    </h1>
                </div>

                {/* Nội dung chính */}
                <div className='max-w-full mx-auto'>
                    <div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
                        {/* Các nút hành động */}
                        {localStorage.getItem('role') === 'parent' ? null : (
                            <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center'>
                                <Link
                                    to='/home/list-classrooms/add'
                                    className='bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition flex items-center gap-2 w-full sm:w-auto justify-center'>
                                    <span className='fa fa-plus'></span> Thêm
                                    lớp học
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
                                            apiData={classrooms}
                                            fileName={item || 'Classrooms'}
                                            id='export-excel-button'
                                        />
                                    </div>
                                </button>
                                <Link
                                    to='/home/list-classrooms/import-data'
                                    className='bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition flex items-center gap-2 w-full sm:w-auto justify-center'>
                                    <span className='fa fa-file-import'></span>{' '}
                                    Nhập dữ liệu từ Excel
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Danh sách lớp học */}
                    <div className='bg-white p-6 rounded-lg shadow-lg'>
                        <ListSV
                            classrooms={classrooms}
                            onDelete={this.onDelete}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default ListClassroom;
