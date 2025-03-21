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
            attendances: this.props.attendances,
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
            attendances: this.props.attendances,
        });
        console.log(this.state.attendances);
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
        var attendances = this.props.attendances;
        console.log(attendances);
        if (filter) {
            if (filter.name) {
                attendances = attendances.filter((attendance) => {
                    return attendance.name.indexOf(filter.name) !== -1;
                });
            }
            if (filter.gender) {
                attendances = attendances.filter((attendance) => {
                    if (filter.gender === 'all') return true;
                    else return attendance.gender === filter.gender;
                });
            }
        }

        if (sort) {
            if (sort.by === 'msv') {
                attendances.sort((attendance1, attendance2) => {
                    //console.log(typeof attendance1.name,'-',attendance2.name);
                    if (attendance1.msv > attendance2.msv) return sort.value;
                    else if (attendance1.msv < attendance2.msv)
                        return -sort.value;
                    else return 0;
                });
            } else if (sort.by === 'name') {
                attendances.sort((attendance1, attendance2) => {
                    if (attendance1.name.localeCompare(attendance2.name) < 0)
                        return sort.value;
                    else if (
                        attendance1.name.localeCompare(attendance2.name) > 0
                    )
                        return -sort.value;
                    else return 0;
                });
            } else {
                attendances.sort((attendance1, attendance2) => {
                    if (attendance1.gpa > attendance2.gpa) return sort.value;
                    else if (attendance1.gpa < attendance2.gpa)
                        return -sort.value;
                    else return 0;
                });
            }
        }
        console.log(attendances);
        var attendanceList = attendances.map((attendance, index) => {
            return (
                <OneRowData
                    key={attendance.id}
                    index={index}
                    attendance={attendance}
                    onDelete={this.onDelete}
                />
            );
        });
        return (
            <div>
                <table className='table table-bordered table-hover'>
                    <Sort onSort={this.onSort} />
                    <tbody>{attendanceList}</tbody>
                </table>
            </div>
        );
    }
}

export default ListSV;
