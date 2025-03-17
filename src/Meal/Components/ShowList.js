/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import SortMeal from './Sort'; // Import SortMeal thay vì Sort
import OneRowData from './OneRowData';

class ListSV extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meals: this.props.meals, // Đổi từ subjects thành meals
            filter: {
                name: '', // Chỉ giữ filter cho name
            },
            sort: {
                by: 'name', // Mặc định sắp xếp theo name
                value: 1, // 1: A -> Z, -1: Z -> A
            },
        };
    }

    componentDidMount() {
        this.setState({
            meals: this.props.meals,
        });
        console.log('Meals from props:', this.state.meals);
    }

    componentDidUpdate(prevProps) {
        // Cập nhật meals khi props thay đổi
        if (prevProps.meals !== this.props.meals) {
            this.setState({
                meals: this.props.meals,
            });
        }
    }

    onDelete = (_id) => {
        this.props.onDelete(_id); // Chỉ cần _id để xóa
    };

    onChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            filter: {
                ...this.state.filter,
                [name]: value,
            },
        });
    };

    onSort = (sortBy, sortValue) => {
        this.setState({
            sort: {
                by: sortBy,
                value: sortValue,
            },
        });
    };

    render() {
        const { filter, sort } = this.state;
        let meals = [...this.props.meals]; // Tạo bản sao để không thay đổi props trực tiếp

        // Lọc theo tên
        if (filter.name) {
            meals = meals.filter((meal) => {
                return (
                    meal.name
                        .toLowerCase()
                        .indexOf(filter.name.toLowerCase()) !== -1
                );
            });
        }

        // Sắp xếp
        if (sort.by === 'name') {
            meals.sort((meal1, meal2) => {
                return sort.value * meal1.name.localeCompare(meal2.name);
            });
        }

        const mealList = meals.map((meal, index) => {
            return (
                <OneRowData
                    key={meal._id} // Giả sử _id là trường duy nhất để định danh
                    index={index}
                    meal={meal} // Giữ tên prop là meal để tái sử dụng OneRowData
                    onDelete={this.onDelete}
                />
            );
        });

        return (
            <div>
                <table className='table table-bordered table-hover'>
                    <SortMeal onSort={this.onSort} />
                    <tbody>
                        <tr>
                            <td></td> {/* Cột STT */}
                            <td>
                                <input
                                    type='text'
                                    className='form-control'
                                    name='name'
                                    value={filter.name}
                                    onChange={this.onChange}
                                    placeholder='Tìm theo tên bữa ăn'
                                />
                            </td>
                            {/* Loại bỏ các cột không cần thiết như Ngày tạo, Ngày cập nhật nếu không có dữ liệu */}
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        {mealList}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ListSV;
