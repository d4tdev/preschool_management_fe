/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../API/CallApi';
import ListSV from './Components/ShowList';
import ExportToExcel from './Components/ExportData';

class ListUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            lop: [], // Khởi tạo rỗng, sẽ lấy từ API hoặc localStorage
            item: localStorage.getItem('item') || '', // Lớp được chọn
            className: localStorage.getItem('className') || '', // Tên lớp hiển thị
        };
        CallApi(`auth/list-user`, 'GET', null).then((res) => {
            if (res?.data?.data != null) {
                this.setState({
                    users: res.data.data,
                });
            }
        });
    }

    componentDidMount() {}

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
                                this.fetchUsers(this.state.item);
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

    fetchUsers = (classId) => {
        const url = classId ? `user?filters[class_id]=${classId}` : `user`;
        CallApi(url, 'GET', null)
            .then((res) => {
                if (res?.data?.data != null) {
                    this.setState({
                        users: res.data.data,
                    });
                } else {
                    this.setState({
                        users: [],
                    });
                }
            })
            .catch((err) => {
                console.error('Error fetching users:', err);
                this.setState({ users: [] });
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
                this.fetchUsers(id); // Lấy học sinh theo lớp được chọn
            });
        } else {
            // Nếu không chọn lớp (chọn "-- Chọn lớp --"), lấy tất cả học sinh
            localStorage.removeItem('item');
            localStorage.removeItem('className');
            this.setState({ item: '', className: '' }, () => {
                this.fetchUsers();
            });
        }
    };

    findIndex = (_id) => {
        const { users } = this.state;
        return users.findIndex((user) => user._id === _id);
    };

    onDelete = (_id) => {
        const { users } = this.state;
        CallApi(`auth/${_id}`, 'DELETE', null)
            .then((res) => {
                if (res.status == 200) {
                    const index = this.findIndex(_id);
                    users.splice(index, 1);
                    this.setState({ users: [...users] });
                    console.log(`Deleted user with _id: ${_id}`);
                } else {
                    console.error('Delete failed:', res);
                    alert('Xóa trẻ thất bại');
                }
            })
            .catch((err) => {
                console.error('Error deleting user:', err);
                alert('Xóa trẻ thất bại');
            });
    };

    render() {
        const { users, lop, className, item } = this.state;

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
                        {/* Các nút hành động */}
                        {localStorage.getItem('role') === 'parent' ? null : (
                            <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center'>
                                <Link
                                    to='/home/list-users/add'
                                    className='bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 hover:text-white transition flex items-center gap-2 w-full sm:w-auto justify-center'>
                                    <span className='fa fa-plus'></span> Thêm
                                    người dùng
                                </Link>
                                <div className=''>
                                    <ExportToExcel
                                        apiData={users}
                                        fileName={item || 'Users'}
                                        id='export-excel-button'
                                    />
                                </div>
                                <Link
                                    to='/home/list-users/import-data'
                                    className='bg-purple-600 text-white px-6 py-3 rounded-md  hover:bg-purple-700 hover:text-white transition flex items-center gap-2 w-full sm:w-auto justify-center'>
                                    <span className='fa fa-file-import'></span>{' '}
                                    Nhập dữ liệu từ Excel
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Danh sách học sinh */}
                    <div className='bg-white p-6 rounded-lg shadow-lg'>
                        <ListSV users={users} onDelete={this.onDelete} />
                    </div>
                </div>
            </div>
        );
    }
}

export default ListUser;
