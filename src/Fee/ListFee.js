/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import './ListFee.css'; // Giả định có file CSS
import ShowList from './Components/ShowList';
import { Link } from 'react-router-dom';
import CallApi from '../API/CallApi';
import ExportToExcel from './Components/ExportData';

class ListFee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fees: [],
            lop: JSON.parse(localStorage.getItem('lop')) || [], // Lấy danh sách lớp từ localStorage
            item: localStorage.getItem('item') || '', // Lớp được chọn
            className: localStorage.getItem('className') || '', // Tên lớp hiển thị
        };
    }

    componentDidMount() {
        this.fetchFees(); // Lấy tất cả học phí ban đầu
    }

    fetchFees = (classId = '') => {
        let url = '';
        if (localStorage.getItem('role') === 'parent') {
            url = classId
                ? `fee?filters[class_id]=${classId}&filters[parent_id]=${localStorage.getItem(
                      'user'
                  )}`
                : `fee?filters[parent_id]=${localStorage.getItem('user')}`;
        } else {
            url = classId ? `fee?filters[class_id]=${classId}` : `fee`;
        }

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
            });
    };

    ChooseClass = (item, name) => {
        localStorage.setItem('item', item);
        localStorage.setItem('className', name);
        this.setState({ item, className: name }, () => {
            this.fetchFees(item); // Lấy học phí theo lớp được chọn
        });
    };

    onUpdate = (feeId, newStatus) => {
        const updatedFees = this.state.fees.map((fee) =>
            fee.id === feeId ? { ...fee, status: newStatus } : fee
        );
        this.setState({ fees: updatedFees });
    };

    render() {
        const { fees, lop, className } = this.state;

        return (
            <div className='Container'>
                <div className='text_center my-20'>
                    <h1 id='qlsv'>Quản lý học phí</h1>
                </div>
                <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                    <div className='flex w-full'>
                        {localStorage.getItem('role') === 'admin' ? (
                            <div className='dropdown'>
                                <button
                                    type='button'
                                    className='btn dropdown-toggle'
                                    id='dropdownMsv'
                                    data-toggle='dropdown'
                                    aria-haspopup='true'
                                    aria-expanded='true'>
                                    Lớp  {' '}
                                    <span className='fa fa-caret-square-o-down'></span>
                                </button>
                                <ul
                                    className='dropdown-menu'
                                    aria-labelledby='dropdownMsv'>
                                    {lop.map((item) => (
                                        <li
                                            key={item.id}
                                            onClick={() =>
                                                this.ChooseClass(
                                                    item.id,
                                                    item.name
                                                )
                                            }>
                                            <a role='button'>{item.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className='dropdown'>
                                <button className='btn dropdown-toggle'>
                                    Lớp  {' '}
                                </button>
                            </div>
                        )}
                        <label
                            style={{
                                paddingTop: '8px',
                                paddingBottom: '2px',
                                marginRight: '10px',
                            }}>
                            {className}
                        </label>
                        {localStorage.getItem('role') === 'parent' ? null : (
                            <div className='w-full'>
                                <Link
                                    to='/home/list-fees/add'
                                    className='btn btn-primary'>
                                    <span className='fa fa-plus'></span>   Thêm
                                    học phí
                                </Link>{' '}
                                <div className='data'>
                                    <ExportToExcel
                                        apiData={fees}
                                        fileName={this.state.item}
                                    />
                                </div>{' '}
                                <Link
                                    to='/home/list-fees/import-data'
                                    className='btn btn-primary data'>
                                    <span className='fa fa-file-import'></span>{' '}
                                      Nhập dữ liệu từ Excel
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className='row'>
                        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                            <ShowList fees={fees} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ListFee;
