/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../API/CallApi';
import ListSV from './Components/ShowList';
import ExportToExcel from './Components/ExportData';
import moment from 'moment';

class ListAttendance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attendances: [], // Danh sách điểm danh
            item: localStorage.getItem('item') || '',
        };
    }

    componentDidMount() {
        // Lấy danh sách điểm danh
        CallApi(
            `attendance?filters[parent_id]=${localStorage.getItem(
                'user'
            )}&filters[month]=${moment().format('MM')}`,
            'GET',
            null
        ).then((res) => {
            if (res?.data?.data != null) {
                this.setState({
                    attendances: res.data.data,
                });
            } else {
                this.setState({
                    attendances: [],
                });
            }
        });
    }

    findIndex = (id) => {
        const { attendances } = this.state;
        return attendances.findIndex((attendance) => attendance.id === id);
    };

    onDelete = (id) => {
        const { attendances } = this.state;
        CallApi(`attendance/${id}`, 'DELETE', null).then((res) => {
            if (res.status === 200) {
                const index = this.findIndex(id);
                if (index !== -1) {
                    attendances.splice(index, 1);
                    this.setState({ attendances: [...attendances] });
                }
            }
        });
    };

    render() {
        const { attendances } = this.state;

        return (
            <div className='min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-8'>
                {/* Tiêu đề */}
                <div className='text-center mb-12'>
                    <h1 className='text-6xl font-bold text-gray-800'>
                        Danh sách điểm danh
                    </h1>
                    {attendances.length > 0 && (
                        <h3 className='mt-6 text-3xl text-gray-600'>
                            của bé:{' '}
                            {attendances[0]?.student_id?.name ||
                                'Không có thông tin'}
                        </h3>
                    )}
                </div>

                {/* Nội dung chính */}
                <div className='max-w-full mx-auto'>
                    <div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
                        {/* Nút Export to Excel */}
                        <div className='flex gap-4 w-full sm:w-auto justify-center'>
                            <div className=''>
                                <ExportToExcel
                                    apiData={attendances}
                                    fileName={`Attendance_${
                                        attendances.length > 0
                                            ? attendances[0]?.student_id
                                                  ?.name || 'Unknown'
                                            : 'Unknown'
                                    }`}
                                    id='export-excel-button'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Danh sách điểm danh */}
                    <div className='bg-white p-6 rounded-lg shadow-lg'>
                        <ListSV
                            attendances={attendances}
                            onDelete={this.onDelete}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default ListAttendance;
