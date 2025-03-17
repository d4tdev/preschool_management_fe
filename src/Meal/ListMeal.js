/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import './ListMeal.css'; // Đổi tên file CSS nếu cần
import ListSV from './Components/ShowList';
import { Link } from 'react-router-dom';
import CallApi from '../API/CallApi';
import ExportToExcel from './Components/ExportData';

class ListMeal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meals: [], // Đổi từ subjects thành meals
            lop: [],
            item: localStorage.getItem('item'),
        };
    }

    componentDidMount() {
        // Khởi tạo danh sách lớp từ localStorage
        if (localStorage.getItem('lop')) {
            this.setState({
                lop: localStorage.getItem('lop').split(', '),
            });
        }

        // Lấy danh sách meals từ API
        this.fetchMeals();
    }

    fetchMeals = () => {
        CallApi(`meal`, 'GET', null)
            .then((res) => {
                if (res?.data?.data != null) {
                    this.setState({
                        meals: res.data.data, // Cập nhật meals thay vì subjects
                    });
                } else {
                    this.setState({
                        meals: [],
                    });
                }
                console.log('Fetched meals:', this.state.meals);
            })
            .catch((err) => {
                console.error('Error fetching meals:', err);
            });
    };

    ChooseClass = (item) => {
        localStorage.setItem('item', item);
        this.setState({ item });
        this.fetchMeals(); // Fetch lại danh sách meals khi chọn lớp
    };

    onDelete = (_id) => {
        CallApi(`meal/${_id}`, 'DELETE', null)
            .then((res) => {
                if (res.status === 200) {
                    // Fetch lại danh sách meals từ server sau khi xóa
                    this.fetchMeals();
                    console.log(`Deleted meal with _id: ${_id}`);
                } else {
                    console.error('Delete failed:', res);
                    alert('Xóa bữa ăn thất bại');
                }
            })
            .catch((err) => {
                console.error('Error deleting meal:', err);
                alert('Xóa bữa ăn thất bại');
            });
    };

    render() {
        const { lop, meals } = this.state;

        return (
            <div className='Container'>
                <div className='text_center my-20'>
                    <h1 id='qlsv'>Quản lý bữa ăn</h1>
                </div>
                <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                    <Link to='/home/list-meals/add' className='btn btn-primary'>
                        <span className='fa fa-plus'></span>   Thêm bữa ăn
                    </Link>{' '}
                    <div className='data'>
                        <ExportToExcel
                            apiData={meals}
                            fileName={this.state.item}
                        />
                    </div>{' '}
                    <Link
                        to='/home/list-meals/import-data'
                        className='btn btn-primary data'>
                        <span className='fa fa-file-import'></span>  Nhập dữ
                        liệu từ Excel
                    </Link>
                    <div className='row'>
                        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                            <ListSV
                                meals={meals} // Truyền meals thay vì subjects
                                onDelete={this.onDelete}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ListMeal;
