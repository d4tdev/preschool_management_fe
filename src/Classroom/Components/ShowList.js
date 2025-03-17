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
            classrooms: this.props.classrooms,
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
            classrooms: this.props.classrooms,
        });
        console.log(this.state.classrooms);
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
        var classrooms = this.props.classrooms;
        console.log(classrooms);
        if (filter) {
            if (filter.name) {
                classrooms = classrooms.filter((classroom) => {
                    return classroom.name.indexOf(filter.name) !== -1;
                });
            }
            if (filter.gender) {
                classrooms = classrooms.filter((classroom) => {
                    if (filter.gender === 'all') return true;
                    else return classroom.gender === filter.gender;
                });
            }
        }

        if (sort) {
            if (sort.by === 'msv') {
                classrooms.sort((classroom1, classroom2) => {
                    //console.log(typeof classroom1.name,'-',classroom2.name);
                    if (classroom1.msv > classroom2.msv) return sort.value;
                    else if (classroom1.msv < classroom2.msv)
                        return -sort.value;
                    else return 0;
                });
            } else if (sort.by === 'name') {
                classrooms.sort((classroom1, classroom2) => {
                    if (classroom1.name.localeCompare(classroom2.name) < 0)
                        return sort.value;
                    else if (classroom1.name.localeCompare(classroom2.name) > 0)
                        return -sort.value;
                    else return 0;
                });
            } else {
                classrooms.sort((classroom1, classroom2) => {
                    if (classroom1.gpa > classroom2.gpa) return sort.value;
                    else if (classroom1.gpa < classroom2.gpa)
                        return -sort.value;
                    else return 0;
                });
            }
        }

        var classroomList = classrooms.map((classroom, index) => {
            return (
                <OneRowData
                    key={classroom.id}
                    index={index}
                    classroom={classroom}
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
                        {classroomList}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ListSV;
