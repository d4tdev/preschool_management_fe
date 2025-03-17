/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import Sort from './Sort';
import OneRowData from './OneRowData';
import CallApi from '../../API/CallApi';

class ListSV extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fees: this.props.fees,
            filter: {
                name: '',
                teacher_id: '',
                created_at: '',
                updated_at: '',
            },
            sort: {
                by: 'msv',
                value: 1,
            },
        };
    }

    componentDidMount() {
        this.setState({
            fees: this.props.fees,
        });
        console.log(this.state.fees);
    }

    onDelete = (_id, msv) => {
        this.props.onDelete(_id, msv);
    };

    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            filter: {
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
        var { filter, sort } = this.state;
        var fees = this.props.fees;
        if (filter) {
            if (filter.name) {
                fees = fees.filter((fee) => {
                    return fee.student_id.name.indexOf(filter.name) !== -1;
                });
            }
            if (filter.status) {
                fees = fees.filter((fee) => {
                    return (
                        fee.status === filter.status || filter.status === 'all'
                    );
                });
            }
        }

        if (sort) {
            if (sort.by === 'id') {
                fees.sort((fee1, fee2) => {
                    if (fee1.id > fee2.id) return sort.value;
                    else if (fee1.id < fee2.id) return -sort.value;
                    else return 0;
                });
            } else if (sort.by === 'name') {
                fees.sort((fee1, fee2) => {
                    if (fee1.name.localeCompare(fee2.name) < 0)
                        return sort.value;
                    else if (fee1.name.localeCompare(fee2.name) > 0)
                        return -sort.value;
                    else return 0;
                });
            }
        }
        console.log(fees);
        var feeList = fees.map((fee, index) => {
            return (
                <OneRowData
                    key={fee.id}
                    index={index}
                    fee={fee}
                    onDelete={this.onDelete}
                />
            );
        });
        return (
            <div>
                <table className='table table-bordered table-hover'>
                    <Sort onSort={this.onSort} />
                    <tbody>
                        <tr>
                            <td></td>
                            <td>
                                <input
                                    type='text'
                                    className='form-control'
                                    name='name'
                                    value={filter.name}
                                    onChange={this.onChange}
                                />
                            </td>
                            <td></td>
                            <td></td>
                            <td>
                                <select
                                    className='form-control'
                                    name='status'
                                    value={filter.status}
                                    onChange={this.onChange}>
                                    <option value='all'>Tất cả</option>
                                    <option value='done'>Đã nộp</option>
                                    <option value='not_yet'>Chưa nộp</option>
                                </select>
                            </td>
                        </tr>
                        {feeList}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ListSV;
