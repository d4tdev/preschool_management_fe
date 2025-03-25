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
            users: this.props.users,
            filter: {
                name: '',
                role: '',
                email: '',
                phone: '',
            },
            sort: {
                by: 'msv',
                value: 1,
            },
        };
    }

    componentDidMount() {
        this.setState({
            users: this.props.users,
        });
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
        var users = this.props.users;
        if (filter) {
            if (filter.name) {
                users = users.filter((user) => {
                    return user.name.indexOf(filter.name) !== -1;
                });
            }
            if (filter.role) {
                users = users.filter((user) => {
                    if (filter.role === 'all') return true;
                    else return user.role === filter.role;
                });
            }
        }

        if (sort) {
            if (sort.by === 'msv') {
                users.sort((user1, user2) => {
                    //console.log(typeof user1.name,'-',user2.name);
                    if (user1.msv > user2.msv) return sort.value;
                    else if (user1.msv < user2.msv) return -sort.value;
                    else return 0;
                });
            } else if (sort.by === 'name') {
                users.sort((user1, user2) => {
                    if (user1.name.localeCompare(user2.name) < 0)
                        return sort.value;
                    else if (user1.name.localeCompare(user2.name) > 0)
                        return -sort.value;
                    else return 0;
                });
            } else {
                users.sort((user1, user2) => {
                    if (user1.gpa > user2.gpa) return sort.value;
                    else if (user1.gpa < user2.gpa) return -sort.value;
                    else return 0;
                });
            }
        }
        var userList = users.map((user, index) => {
            return (
                <OneRowData
                    key={user.id}
                    index={index}
                    user={user}
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
                            {/* <td>
                                <input
                                    type='text'
                                    className='form-control'
                                    name='msv'
                                    value={filter.msv}
                                    onChange={this.onChange}
                                />
                            </td> */}
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
                                    name='role'
                                    value={filter.role}
                                    onChange={this.onChange}>
                                    <option value='all'>Tất cả</option>
                                    <option value='admin'>Admin</option>
                                    <option value='parent'>Phụ huynh</option>
                                    <option value='teacher'>Giáo viên</option>
                                </select>
                            </td>

                            <td></td>
                        </tr>
                        {userList}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ListSV;
