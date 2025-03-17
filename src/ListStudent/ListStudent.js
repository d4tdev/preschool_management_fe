/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import './ListStudent.css';
import ListSV from './Components/ShowList';
import { Link } from 'react-router-dom';
import CallApi from '../API/CallApi';
import ExportToExcel from './Components/ExportData';
class ListStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            lop: [],
            item: localStorage.getItem('item'),
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
        CallApi(`student`, 'GET', null).then((res) => {
            if (res?.data?.data != null) {
                this.setState({
                    students: res?.data?.data,
                });
            } else {
                this.setState({
                    students: [],
                });
            }
        });
    }

    ChooseClass = (item, name) => {
        localStorage.setItem('item', item);
        localStorage.setItem('className', name);
        CallApi(`student?filters[class_id]=${item}`, 'GET', null).then(
            (res) => {
                if (res?.data?.data != null) {
                    this.setState({
                        students: res?.data?.data,
                    });
                } else {
                    this.setState({
                        students: [],
                    });
                }
            }
        );
    };

    findIndex = (_id) => {
        var { students } = this.state;
        var result = -1;
        students.forEach((student, index) => {
            if (student._id === _id) result = index;
        });
        return result;
    };

    fetchStudents = () => {
        CallApi(`student`, 'GET', null).then((res) => {
            if (res?.data?.data != null) {
                this.setState({
                    lop: res?.data?.data,
                });
            } else {
                this.setState({
                    lop: [],
                });
            }
        });
    };

    onDelete = (_id) => {
        CallApi(`student/${_id}`, 'DELETE', null)
            .then((res) => {
                if (res.status === 200) {
                    // Fetch lại danh sách students từ server sau khi xóa
                    this.fetchStudents();
                    console.log(`Deleted student with _id: ${_id}`);
                } else {
                    console.error('Delete failed:', res);
                    alert('Xóa học sinh thất bại');
                }
            })
            .catch((err) => {
                console.error('Error deleting student:', err);
                alert('Xóa học sinh thất bại');
            });
    };

    render() {
        var { lop, students } = this.state;
        return (
            <div className='Container'>
                <div className='text_center my-20'>
                    <h1 id='qlsv'>Quản lý học sinh</h1>
                </div>
                <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                    &nbsp;
                    <div className='dropdown'>
                        <button
                            type='button'
                            className='btn dropdown-toggle'
                            id='dropdownMsv'
                            data-toggle='dropdown'
                            aria-haspopup='true'
                            aria-expanded='true'>
                            Lớp &nbsp;{' '}
                            <span className='fa fa-caret-square-o-down'></span>
                        </button>
                        <ul
                            className='dropdown-menu'
                            aria-labelledby='dropdownMenu1'>
                            {JSON.parse(localStorage.getItem('lop')).map(
                                (item) => (
                                    <li
                                        to='/home/list-students'
                                        key={item.id}
                                        onClick={() =>
                                            this.ChooseClass(item.id, item.name)
                                        }>
                                        <a role='button'>{item.name}</a>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                    <label
                        style={{
                            paddingTop: '8px',
                            paddingBottom: '2px',
                            marginRight: '10px',
                        }}>
                        {localStorage.getItem('className')}
                    </label>
                    <Link
                        to='/home/list-students/add'
                        className='btn btn-primary'>
                        <span className='fa fa-plus'></span> &nbsp; Thêm học
                        sinh
                    </Link>{' '}
                    &nbsp;
                    <div className='data'>
                        <ExportToExcel
                            apiData={students}
                            fileName={this.state.item}
                        />
                    </div>
                    &nbsp;
                    <Link
                        to='/home/list-students/import-data'
                        className='btn btn-primary data'>
                        <span className='fa fa-file-import'></span>&nbsp; Nhập
                        dữ liệu từ Excel
                    </Link>
                    <div className='row'>
                        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                            <ListSV
                                students={students}
                                onDelete={this.onDelete}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ListStudent;
