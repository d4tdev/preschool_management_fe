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
            situations: this.props.situations,
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
            situations: this.props.situations,
        });
        console.log(this.state.situations);
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
        var situations = this.props.situations;
        console.log(situations);
        if (filter) {
            if (filter.name) {
                situations = situations.filter((situation) => {
                    return situation.name.indexOf(filter.name) !== -1;
                });
            }
            if (filter.gender) {
                situations = situations.filter((situation) => {
                    if (filter.gender === 'all') return true;
                    else return situation.gender === filter.gender;
                });
            }
        }

        if (sort) {
            if (sort.by === 'msv') {
                situations.sort((situation1, situation2) => {
                    //console.log(typeof situation1.name,'-',situation2.name);
                    if (situation1.msv > situation2.msv) return sort.value;
                    else if (situation1.msv < situation2.msv)
                        return -sort.value;
                    else return 0;
                });
            } else if (sort.by === 'name') {
                situations.sort((situation1, situation2) => {
                    if (situation1.name.localeCompare(situation2.name) < 0)
                        return sort.value;
                    else if (situation1.name.localeCompare(situation2.name) > 0)
                        return -sort.value;
                    else return 0;
                });
            } else {
                situations.sort((situation1, situation2) => {
                    if (situation1.gpa > situation2.gpa) return sort.value;
                    else if (situation1.gpa < situation2.gpa)
                        return -sort.value;
                    else return 0;
                });
            }
        }
        console.log(situations);
        var situationList = situations.map((situation, index) => {
            return (
                <OneRowData
                    key={situation.id}
                    index={index}
                    situation={situation}
                    onDelete={this.onDelete}
                />
            );
        });
        return (
            <div>
                <table className='table table-bordered table-hover'>
                    <Sort onSort={this.onSort} />
                    <tbody>{situationList}</tbody>
                </table>
            </div>
        );
    }
}

export default ListSV;
