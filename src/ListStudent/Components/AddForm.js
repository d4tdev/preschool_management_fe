import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../../API/CallApi';
import axios from 'axios';
import moment from 'moment';
class AddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            birthday: '',
            gender: '',
            class: '',
            parent: '',
        };
    }

    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        this.setState({
            [name]: value,
        });
    };

    onSubmit = (event) => {
        event.preventDefault();
        CallApi('student', 'POST', {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            birthday: moment(this.state.birthday).format('YYYY-MM-DD'),
            gender: this.state.gender,
            parent_id: this.state.parent,
            class_id: this.state.class,
        });

        // const headers = {
        //     'PRIVATE-KEY': '14bf1d3f-a86c-4b1b-ad74-9675722ee4f8',
        // };

        // axios.post(
        //     'https://api.chatengine.io/users/',
        //     {
        //         username: this.state.msv.toString(),
        //         secret: this.state.msv.toString(),
        //     },
        //     {
        //         headers: headers,
        //     }
        // );

        this.setState({
            first_name: '',
            last_name: '',
            birthday: '',
            gender: '',
            parent: '',
            class: '',
        });
        alert('Đã thêm thành công');
    };

    render() {
        return (
            <div className='addForm'>
                <div className='back'>
                    <Link to='/home/list-students' className='btn btn-danger'>
                        <span className='fa fa-arrow-left'></span> &nbsp; Quay
                        lại
                    </Link>
                </div>
                <div className='col-xs-5 col-sm-5 col-md-5 col-lg-5 center'>
                    <div className='panel panel-warning'>
                        <div className='panel-heading'>
                            <h3 className='panel-title'>Thêm học sinh</h3>
                        </div>
                        <div className='panel-body'>
                            <form onSubmit={this.onSubmit}>
                                <div className='form-group'>
                                    <label>Họ: </label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        required
                                        name='first_name'
                                        value={this.state.first_name}
                                        onChange={this.onChange}
                                    />
                                    <label>Tên: </label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        required
                                        name='last_name'
                                        value={this.state.last_name}
                                        onChange={this.onChange}
                                    />
                                    <label>Ngày sinh: </label>
                                    <input
                                        type='date'
                                        className='form-control'
                                        required
                                        name='birthday'
                                        value={this.state.birthday}
                                        onChange={this.onChange}
                                    />
                                    <label>Giới tính:</label>
                                    <select
                                        className='form-control'
                                        name='gender'
                                        required
                                        value={this.state.gender}
                                        onChange={this.onChange}>
                                        <option>--Select--</option>
                                        <option value='Nam'>Nam</option>
                                        <option value='Nữ'>Nữ</option>
                                    </select>

                                    <label>Lớp:</label>
                                    <select
                                        className='form-control'
                                        name='class'
                                        required
                                        value={this.state.class}
                                        onChange={this.onChange}>
                                        <option>--Select--</option>
                                        {JSON.parse(
                                            localStorage.getItem('lop')
                                        )?.map((item) => (
                                            <option
                                                key={item.id}
                                                value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label>Phụ huynh:</label>
                                    <select
                                        className='form-control'
                                        name='parent'
                                        required
                                        value={this.state.parent}
                                        onChange={this.onChange}>
                                        <option>--Select--</option>
                                        {JSON.parse(
                                            localStorage.getItem('parents')
                                        )?.map((item) => (
                                            <option
                                                key={item.id}
                                                value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    <br />
                                    <div className='text_center my-20'>
                                        <button
                                            type='submit'
                                            className='button submit btn btn-primary'
                                            onClick={this.onSubmit}>
                                            <span className='fa fa-plus'></span>{' '}
                                            &nbsp;Lưu lại
                                        </button>{' '}
                                        &nbsp;
                                        <Link
                                            to='/home/list-students'
                                            className='button cancle btn btn-primary'>
                                            <span className='fa fa-close'></span>{' '}
                                            &nbsp;Hủy bỏ
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddForm;
