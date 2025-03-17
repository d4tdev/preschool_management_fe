/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import './ListSubject.css';
import ListSV from './Components/ShowList';
import { Link } from 'react-router-dom';
import CallApi from '../API/CallApi';
import ExportToExcel from './Components/ExportData';
class ListSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subjects: [],
            lop: [],
            item: localStorage.getItem('item'),
        };
    }

    componentDidMount() {
        if (localStorage.getItem('item') !== null) {
            this.setState({
                lop: localStorage.getItem('lop').split(', '),
            });
        }

        var item = localStorage.getItem('item');
        CallApi(`subject`, 'GET', null).then((res) => {
            if (res?.data?.data != null) {
                this.setState({
                    subjects: res?.data?.data,
                });
            } else {
                this.setState({
                    subjects: [],
                });
            }
            console.log(this.state.subjects);
        });
    }

    ChooseClass = (item) => {
        localStorage.setItem('item', item);
        CallApi(`subject`, 'GET', null).then((res) => {
            if (res?.data?.data != null) {
                this.setState({
                    subjects: res?.data?.data,
                });
            } else {
                this.setState({
                    subjects: [],
                });
            }
        });
    };

    findIndex = (_id) => {
        var { subjects } = this.state;
        var result = -1;
        subjects.forEach((subject, index) => {
            if (subject._id === _id) result = index;
        });
        return result;
    };

    fetchSubjects = () => {
        CallApi(`subject`, 'GET', null).then((res) => {
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
        CallApi(`subject/${_id}`, 'DELETE', null)
            .then((res) => {
                if (res.status === 200) {
                    // Fetch lại danh sách subjects từ server sau khi xóa
                    this.fetchSubjects();
                    console.log(`Deleted subject with _id: ${_id}`);
                } else {
                    console.error('Delete failed:', res);
                    alert('Xóa môn học thất bại');
                }
            })
            .catch((err) => {
                console.error('Error deleting subject:', err);
                alert('Xóa môn học thất bại');
            });
    };

    render() {
        var { lop, subjects } = this.state;
        return (
            <div className='Container'>
                <div className='text_center my-20'>
                    <h1 id='qlsv'>Quản lý môn học</h1>
                </div>
                <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                    <Link
                        to='/home/list-subjects/add'
                        className='btn btn-primary'>
                        <span className='fa fa-plus'></span> &nbsp; Thêm môn học
                    </Link>{' '}
                    &nbsp;
                    <div className='data'>
                        <ExportToExcel
                            apiData={subjects}
                            fileName={this.state.item}
                        />
                    </div>
                    &nbsp;
                    <Link
                        to='/home/list-subjects/import-data'
                        className='btn btn-primary data'>
                        <span className='fa fa-file-import'></span>&nbsp; Nhập
                        dữ liệu từ Excel
                    </Link>
                    <div className='row'>
                        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                            <ListSV
                                subjects={subjects}
                                onDelete={this.onDelete}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ListSubject;
