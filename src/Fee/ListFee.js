/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../API/CallApi';
import ShowList from './Components/ShowList';
import ExportToExcel from './Components/ExportData';

class ListFee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fees: [],
            lop: [], // Khởi tạo rỗng, sẽ lấy từ API hoặc localStorage
            item: localStorage.getItem('item') || '', // Lớp được chọn
            className: localStorage.getItem('className') || '', // Tên lớp hiển thị
        };
    }

    componentDidMount() {
        // Lấy danh sách lớp từ localStorage hoặc API
        const storedLop = localStorage.getItem('lop');
        if (storedLop) {
            try {
                const parsedLop = JSON.parse(storedLop);
                this.setState({ lop: parsedLop }, () => {
                    // Nếu đã có item trong localStorage, lấy học phí theo lớp đó
                    if (this.state.item) {
                        const selectedClass = parsedLop.find(
                            (item) => item.id === this.state.item
                        );
                        if (selectedClass) {
                            this.setState({ className: selectedClass.name });
                            this.fetchFees(this.state.item);
                        }
                    } else {
                        this.fetchFees(); // Lấy tất cả học phí nếu không có lớp được chọn
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
                                this.fetchFees(this.state.item);
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

    fetchFees = (classId) => {
        let url = '';
        if (localStorage.getItem('role') === 'parent') {
            url = classId
                ? `fee?filters[class_id]=${classId}&filters[parent_id]=${localStorage.getItem(
                      'user'
                  )}`
                : `fee?filters[parent_id]=${localStorage.getItem('user')}`;
        } else {
            console.log('day');
            url = classId ? `fee?filters[class_id]=${classId}` : `fee`;
        }

        console.log(url);
        CallApi(url, 'GET', null)
            .then((res) => {
                if (res?.data?.data != null) {
                    this.setState({
                        fees: res.data.data,
                    });
                } else {
                    this.setState({
                        fees: [],
                    });
                }
            })
            .catch((err) => {
                console.error('Error fetching fees:', err);
                this.setState({ fees: [] });
            });
    };

    ChooseClass = (event) => {
        const classId = event.target.value;
        console.log('classId:', classId);
        console.log(this.state.lop);
        const selectedClass = this.state.lop.find((item) => item.id == classId);
        if (selectedClass) {
            const { id, name } = selectedClass;
            localStorage.setItem('item', id);
            localStorage.setItem('className', name);
            this.setState({ item: id, className: name }, () => {
                this.fetchFees(id); // Lấy học phí theo lớp được chọn
            });
        } else {
            // Nếu không chọn lớp (chọn "-- Chọn lớp --"), lấy tất cả học phí
            localStorage.removeItem('item');
            localStorage.removeItem('className');
            this.setState({ item: '', className: '' }, () => {
                this.fetchFees();
            });
        }
    };

    onUpdate = (feeId, newStatus) => {
        const updatedFees = this.state.fees.map((fee) =>
            fee.id === feeId ? { ...fee, status: newStatus } : fee
        );
        this.setState({ fees: updatedFees });
    };

    render() {
        const { fees, lop, className, item } = this.state;

        return (
            <div className='min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-8'>
                {/* Tiêu đề */}
                <div className='text-center mb-12'>
                    <h1 className='text-6xl font-bold text-gray-800'>
                        Quản lý học phí
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
                                    {fees[0]?.student_id?.class_id?.name ||
                                        className}
                                </span>
                            </div>
                        )}

                        {/* Các nút hành động */}
                        {localStorage.getItem('role') === 'parent' ? null : (
                            <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center'>
                                <Link
                                    to='/home/list-fees/add'
                                    className='bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition flex items-center gap-2 w-full sm:w-auto justify-center'>
                                    <span className='fa fa-plus'></span> Thêm
                                    học phí
                                </Link>
                                <div className=''>
                                    <ExportToExcel
                                        apiData={fees}
                                        fileName={item || 'Fees'}
                                        id='export-excel-button'
                                    />
                                </div>
                                <Link
                                    to='/home/list-fees/import-data'
                                    className='bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition flex items-center gap-2 w-full sm:w-auto justify-center'>
                                    <span className='fa fa-file-import'></span>{' '}
                                    Nhập dữ liệu từ Excel
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Danh sách học phí */}
                    <div className='bg-white p-6 rounded-lg shadow-lg'>
                        <ShowList fees={fees} onUpdate={this.onUpdate} />
                    </div>
                </div>
            </div>
        );
    }
}

export default ListFee;
