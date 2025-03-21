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
            students: this.props.students,
            filter: {
                name: '',
                age: '',
                gender: '',
                classroom: '',
                parent: '',
            },
            sort: {
                by: 'msv',
                value: 1,
            },
        };
    }

    componentDidMount() {
        this.setState({
            students: this.props.students,
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
        var students = this.props.students;
        if (filter) {
            if (filter.name) {
                students = students.filter((student) => {
                    return student.name.indexOf(filter.name) !== -1;
                });
            }
            if (filter.gender) {
                students = students.filter((student) => {
                    if (filter.gender === 'all') return true;
                    else return student.gender === filter.gender;
                });
            }
        }

        if (sort) {
            if (sort.by === 'msv') {
                students.sort((student1, student2) => {
                    //console.log(typeof student1.name,'-',student2.name);
                    if (student1.msv > student2.msv) return sort.value;
                    else if (student1.msv < student2.msv) return -sort.value;
                    else return 0;
                });
            } else if (sort.by === 'name') {
                students.sort((student1, student2) => {
                    if (student1.name.localeCompare(student2.name) < 0)
                        return sort.value;
                    else if (student1.name.localeCompare(student2.name) > 0)
                        return -sort.value;
                    else return 0;
                });
            } else {
                students.sort((student1, student2) => {
                    if (student1.gpa > student2.gpa) return sort.value;
                    else if (student1.gpa < student2.gpa) return -sort.value;
                    else return 0;
                });
            }
        }
        var studentList = students.map((student, index) => {
            return (
                <OneRowData
                    key={student.id}
                    index={index}
                    student={student}
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
                            <td>
                                <select
                                    className='form-control'
                                    name='gender'
                                    value={filter.gender}
                                    onChange={this.onChange}>
                                    <option value='all'>Tất cả</option>
                                    <option value='Nam'>Nam</option>
                                    <option value='Nữ'>Nữ</option>
                                </select>
                            </td>
                            <td></td>

                            <td></td>
                        </tr>
                        {studentList}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ListSV;
