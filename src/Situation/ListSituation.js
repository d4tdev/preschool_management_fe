/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../API/CallApi';
import ListSV from './Components/ShowList';
import ExportToExcel from './Components/ExportData';

class ListSituation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            situations: [],
            lop: JSON.parse(localStorage.getItem('lop')) || [], // Sửa lại cách lấy lop
            item: localStorage.getItem('item') || '',
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
        // Lấy danh sách thông báo
        CallApi(
            `situation?filters[parent_id]=${localStorage.getItem('user')}`,
            'GET',
            null
        ).then((res) => {
            if (res?.data?.data != null) {
                this.setState({
                    situations: res.data.data,
                });
            } else {
                this.setState({
                    situations: [],
                });
            }
        });
    }

    ChooseClass = (event) => {
        const selectedClassId = event.target.value;
        localStorage.setItem('item', selectedClassId);
        this.setState({ item: selectedClassId }, () => {
            CallApi(`situation`, 'GET', null).then((res) => {
                if (res?.data?.data != null) {
                    this.setState({
                        situations: res.data.data,
                    });
                } else {
                    this.setState({
                        situations: [],
                    });
                }
            });
        });
    };

    findIndex = (_id) => {
        const { situations } = this.state;
        return situations.findIndex((situation) => situation._id === _id);
    };

    onDelete = (_id) => {
        const { situations } = this.state;
        CallApi(`situation/${_id}`, 'DELETE', null).then((res) => {
            if (res.status === 200) {
                const index = this.findIndex(_id);
                if (index !== -1) {
                    situations.splice(index, 1);
                    this.setState({
                        situations: [...situations],
                    });
                }
            }
        });
    };

    render() {
        const { situations, lop, item } = this.state;

        return (
            <div className='min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-8'>
                {/* Tiêu đề */}
                <div className='text-center mb-12'>
                    <h1 className='text-6xl font-bold text-gray-800'>
                        Thông báo từ giáo viên
                    </h1>
                    {situations.length > 0 && (
                        <h3 className='mt-6 text-3xl text-gray-600'>
                            của bé:{' '}
                            {situations[0]?.student_id?.name ||
                                'Không có thông tin'}
                        </h3>
                    )}
                </div>

                {/* Nội dung chính */}
                <div className='max-w-full mx-auto'>
                    <div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
                        {/* Dropdown chọn lớp (nếu cần) */}
                        {localStorage.getItem('role') === 'admin' && (
                            <div className='flex items-center gap-4'>
                                <label className='text-lg font-medium text-gray-700'>
                                    Lớp:
                                </label>
                                <select
                                    value={item}
                                    onChange={this.ChooseClass}
                                    className='p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg w-full sm:w-auto'>
                                    <option value=''>-- Chọn lớp --</option>
                                    {lop.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Nút Export to Excel */}
                        <div className='flex gap-4 w-full sm:w-auto justify-center'>
                            <button
                                className='bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition flex items-center gap-2 w-full sm:w-auto justify-center'
                                onClick={() =>
                                    document
                                        .getElementById('export-excel-button')
                                        ?.click()
                                }>
                                <span className='fa fa-file-export'></span>{' '}
                                Export to Excel
                                <div className='hidden'>
                                    <ExportToExcel
                                        apiData={situations}
                                        fileName={item}
                                        id='export-excel-button'
                                    />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Danh sách thông báo */}
                    <div className='bg-white p-6 rounded-lg shadow-lg'>
                        <ListSV
                            situations={situations}
                            onDelete={this.onDelete}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default ListSituation;
