/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';

class Sort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortby: 'name', // Mặc định sắp xếp theo name của meal
            sortvalue: 1, // 1: tăng dần (A -> Z), -1: giảm dần (Z -> A)
        };
    }

    onSort = (sortBy, sortValue) => {
        this.setState(
            {
                sortby: sortBy,
                sortvalue: sortValue,
            },
            () => this.props.onSort(this.state.sortby, this.state.sortvalue)
        );
    };

    render() {
        return (
            <thead>
                <tr>
                    <th className='text_center' width='50px'>
                        <button className='btn text_center'>STT</button>
                    </th>
                    <th className='text_center'>
                        <div className='dropdown'>
                            <button
                                type='button'
                                className='btn dropdown-toggle'
                                id='dropdownName'
                                data-toggle='dropdown'
                                aria-haspopup='true'
                                aria-expanded='true'>
                                Tên bữa ăn  {' '}
                                <span className='fa fa-caret-square-o-down'></span>
                            </button>
                            <ul
                                className='dropdown-menu'
                                aria-labelledby='dropdownName'>
                                <li onClick={() => this.onSort('name', 1)}>
                                    <a
                                        role='button'
                                        className={
                                            this.state.sortby === 'name' &&
                                            this.state.sortvalue === 1
                                                ? 'sort_selected'
                                                : ''
                                        }>
                                        <span className='fa fa-sort-alpha-up'>
                                            {' '}
                                              A -> Z
                                        </span>
                                    </a>
                                </li>
                                <li onClick={() => this.onSort('name', -1)}>
                                    <a
                                        role='button'
                                        className={
                                            this.state.sortby === 'name' &&
                                            this.state.sortvalue === -1
                                                ? 'sort_selected'
                                                : ''
                                        }>
                                        <span className='fa fa-sort-alpha-down'>
                                            {' '}
                                              Z -> A
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </th>
                    {/* Nếu API meal có thêm createdAt và updatedAt, giữ lại các cột này */}
                    <th className='text_center'>
                        <button className='btn text_center'>Ngày tạo</button>
                    </th>
                    <th className='text_center'>
                        <button className='btn text_center'>
                            Ngày cập nhật
                        </button>
                    </th>
                    <th className='text_center'>
                        <button className='btn text_center'>Hành động</button>
                    </th>
                </tr>
            </thead>
        );
    }
}

export default Sort;
