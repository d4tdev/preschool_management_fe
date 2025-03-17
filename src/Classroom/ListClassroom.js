/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import './ListClassroom.css';
import ListSV from './Components/ShowList';
import { Link } from 'react-router-dom';
import CallApi from '../API/CallApi';
import ExportToExcel from './Components/ExportData';
class ListClassroom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classrooms: [],
            lop: [],
            item: localStorage.getItem('item'),
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
        if (localStorage.getItem('item') !== null) {
            this.setState({
                lop: localStorage.getItem('lop').split(', '),
            });
        }

        var item = localStorage.getItem('item');
        CallApi(`classroom`, 'GET', null).then((res) => {
            if (res?.data?.data != null) {
                this.setState({
                    classrooms: res?.data?.data,
                });
            } else {
                this.setState({
                    classrooms: [],
                });
            }
            console.log(this.state.classrooms);
        });
    }

    ChooseClass = (item) => {
        localStorage.setItem('item', item);
        CallApi(`classroom`, 'GET', null).then((res) => {
            if (res?.data?.data != null) {
                this.setState({
                    classrooms: res?.data?.data,
                });
            } else {
                this.setState({
                    classrooms: [],
                });
            }
        });
    };

    findIndex = (_id) => {
        var { classrooms } = this.state;
        var result = -1;
        classrooms.forEach((classroom, index) => {
            if (classroom._id === _id) result = index;
        });
        return result;
    };

    fetchClassrooms = () => {
        CallApi(`classroom`, 'GET', null)
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
                console.log('Fetched classrooms:', this.state.classrooms);
            })
            .catch((err) => {
                console.error('Error fetching classrooms:', err);
            });
    };

    onDelete = (_id) => {
        CallApi(`classroom/${_id}`, 'DELETE', null)
            .then((res) => {
                if (res.status === 200) {
                    // Fetch lại danh sách classrooms từ server sau khi xóa
                    this.fetchClassrooms();
                    console.log(`Deleted classroom with _id: ${_id}`);
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
        var { lop, classrooms } = this.state;
        return (
            <div className='Container'>
                <div className='text_center my-20'>
                    <h1 id='qlsv'>Quản lý lớp học</h1>
                </div>
                <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                    <Link
                        to='/home/list-classrooms/add'
                        className='btn btn-primary'>
                        <span className='fa fa-plus'></span> &nbsp; Thêm lớp học
                    </Link>{' '}
                    &nbsp;
                    <div className='data'>
                        <ExportToExcel
                            apiData={classrooms}
                            fileName={this.state.item}
                        />
                    </div>
                    &nbsp;
                    <Link
                        to='/home/list-classrooms/import-data'
                        className='btn btn-primary data'>
                        <span className='fa fa-file-import'></span>&nbsp; Nhập
                        dữ liệu từ Excel
                    </Link>
                    <div className='row'>
                        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                            <ListSV
                                classrooms={classrooms}
                                onDelete={this.onDelete}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ListClassroom;
