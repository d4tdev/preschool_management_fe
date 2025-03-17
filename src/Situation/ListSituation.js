/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import './ListSituation.css';
import ListSV from './Components/ShowList';
import { Link } from 'react-router-dom';
import CallApi from '../API/CallApi';
import ExportToExcel from './Components/ExportData';
class ListSituation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            situations: [],
            lop: [],
            item: localStorage.getItem('item'),
        };
        CallApi('auth/list-user?filters[role]=teacher', 'GET', null).then(
            (res) => {
                if (res?.data?.data != null) {
                    localStorage.setItem(
                        'teachers',
                        JSON.stringify(res?.data?.data)
                    );
                }
            }
        );
    }

    componentDidMount() {
        if (localStorage.getItem('item') !== null) {
            this.setState({
                lop: localStorage.getItem('lop').split(', '),
            });
        }

        var item = localStorage.getItem('item');
        CallApi(
            `situation?filters[parent_id]=${localStorage.getItem('user')}`,
            'GET',
            null
        ).then((res) => {
            if (res?.data?.data != null) {
                this.setState({
                    situations: res?.data?.data,
                });
            } else {
                this.setState({
                    situations: [],
                });
            }
            console.log(this.state.situations);
        });
    }

    ChooseClass = (item) => {
        localStorage.setItem('item', item);
        CallApi(`situation`, 'GET', null).then((res) => {
            if (res?.data?.data != null) {
                this.setState({
                    situations: res?.data?.data,
                });
            } else {
                this.setState({
                    situations: [],
                });
            }
        });
    };

    findIndex = (_id) => {
        var { situations } = this.state;
        var result = -1;
        situations.forEach((situation, index) => {
            if (situation._id === _id) result = index;
        });
        return result;
    };

    onDelete = (_id, msv) => {
        var { situations } = this.state;
        CallApi(`situation/${_id}`, 'DELETE', null).then((res) => {
            if (res.status === 200) {
                var index = this.findIndex(_id);
                if (index !== -1) {
                    situations.splice(index, 1);
                    this.setState({
                        situations: situations,
                    });
                }
            }
        });
    };

    render() {
        var { lop, situations } = this.state;
        console.log(situations);

        return (
            <div className='Container'>
                <div className='text_center my-20'>
                    <h1 id='qlsv'>Thông báo từ giáo viên</h1>
                    <h3 className='mt-11 text-5xl'>
                        của bé: {situations[0]?.student_id.name}
                    </h3>
                </div>
                <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                    <div className='data'>
                        <ExportToExcel
                            apiData={situations}
                            fileName={this.state.item}
                        />
                    </div>
                    <div className='row'>
                        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                            <ListSV
                                situations={situations}
                                onDelete={this.onDelete}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ListSituation;
