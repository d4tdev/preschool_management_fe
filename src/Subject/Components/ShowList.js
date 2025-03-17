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
            subjects: this.props.subjects,
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
            subjects: this.props.subjects,
        });
        console.log(this.state.subjects);
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
        var subjects = this.props.subjects;
        console.log(subjects);
        if (filter) {
            if (filter.name) {
                subjects = subjects.filter((subject) => {
                    return subject.name.indexOf(filter.name) !== -1;
                });
            }
            if (filter.gender) {
                subjects = subjects.filter((subject) => {
                    if (filter.gender === 'all') return true;
                    else return subject.gender === filter.gender;
                });
            }
        }

        if (sort) {
            if (sort.by === 'msv') {
                subjects.sort((subject1, subject2) => {
                    //console.log(typeof subject1.name,'-',subject2.name);
                    if (subject1.msv > subject2.msv) return sort.value;
                    else if (subject1.msv < subject2.msv) return -sort.value;
                    else return 0;
                });
            } else if (sort.by === 'name') {
                subjects.sort((subject1, subject2) => {
                    if (subject1.name.localeCompare(subject2.name) < 0)
                        return sort.value;
                    else if (subject1.name.localeCompare(subject2.name) > 0)
                        return -sort.value;
                    else return 0;
                });
            } else {
                subjects.sort((subject1, subject2) => {
                    if (subject1.gpa > subject2.gpa) return sort.value;
                    else if (subject1.gpa < subject2.gpa) return -sort.value;
                    else return 0;
                });
            }
        }
        console.log(subjects);
        var subjectList = subjects.map((subject, index) => {
            return (
                <OneRowData
                    key={subject.id}
                    index={index}
                    subject={subject}
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
                            <td></td>
                        </tr>
                        {subjectList}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ListSV;
