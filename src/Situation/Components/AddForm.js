import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../../API/CallApi';
import axios from 'axios';
import moment from 'moment';
class AddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            teacher: '',
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
        CallApi('classroom', 'POST', {
            name: this.state.name,
            teacher_id: this.state.teacher,
        });

        this.setState({
            name: '',
            teacher: '',
        });
        alert('Đã thêm thành công');
    };

    render() {
        return (
            <div className='addForm'>
                <div className='back'>
                    <Link to='/home/list-classrooms' className='btn btn-danger'>
                        <span className='fa fa-arrow-left'></span> &nbsp; Quay
                        lại
                    </Link>
                </div>
                <div className='col-xs-5 col-sm-5 col-md-5 col-lg-5 center'>
                    <div className='panel panel-warning'>
                        <div className='panel-heading'>
                            <h3 className='panel-title'>Thêm lớp học</h3>
                        </div>
                        <div className='panel-body'>
                            <form onSubmit={this.onSubmit}>
                                <div className='form-group'>
                                    <label>Tên: </label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        required
                                        name='name'
                                        value={this.state.name}
                                        onChange={this.onChange}
                                    />

                                    <label>Giáo viên:</label>
                                    <select
                                        className='form-control'
                                        name='teacher'
                                        required
                                        value={this.state.teacher}
                                        onChange={this.onChange}>
                                        <option>--Select--</option>
                                        {JSON.parse(
                                            localStorage.getItem('teachers')
                                        ).map((item) => (
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
