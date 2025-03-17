import '../NavBar.css';
import NotiList from './Noti/NotiList';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import CallApi from '../../API/CallApi';
import axios from 'axios';
import moment from 'moment';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            day: '',
            note: '',
            review: '',
            eat_status: '',
            recipe: '',
            subject: '',
            subject_id: '',
            students: [],
            unchoosed: [],
            choosed: [],
            selectedOptions: [], // Mảng các giá trị đã chọn
            recipeString: '', // Chuỗi nối các giá trị
            isSelectedAll: false,
        };
        CallApi(
            `student?filters[class_id]=${localStorage.getItem('classId')}`,
            'GET',
            null
        ).then((res) => {
            if (res?.data?.data != null) {
                this.setState({
                    students: res?.data?.data,
                    unchoosed: res?.data?.data,
                });
            } else {
                this.setState({
                    students: [],
                });
            }
        });
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
        CallApi('situation', 'POST', {
            day: this.state.day,
            note: this.state.note,
            review: this.state.review,
            eat_status: this.state.eat_status,
            recipe: this.state.recipeString,
            subject_id: this.state.subject,
            students: this.state.choosed,
        });

        this.setState({
            day: '',
            note: '',
            review: '',
            eat_status: '',
            recipe: '',
            subject: '',
            subject_id: '',
            unchoosed: this.state.students,
            choosed: [],
            selectedOptions: [],
            recipeString: '',
            isSelectedAll: false,
        });
        alert('Đã gửi thông báo thành công');
    };

    onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) {
            return;
        }
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }
        let add;
        const unchoosed = this.state.unchoosed;
        const choosed = this.state.choosed;

        console.log(unchoosed);
        console.log(choosed);

        if (source.droppableId === 'ROOT') {
            add = unchoosed[source.index];
            unchoosed.splice(source.index, 1);
        } else {
            add = choosed[source.index];
            choosed.splice(source.index, 1);
        }

        if (destination.droppableId === 'ROOT') {
            unchoosed.splice(destination.index, 0, add);
        } else {
            choosed.splice(destination.index, 0, add);
        }

        this.setState({ unchoosed, choosed });
    };

    handleCheckboxChange = (event) => {
        const { value, checked } = event.target;

        // Cập nhật mảng selectedOptions
        let newSelectedOptions = [...this.state.selectedOptions];
        if (checked) {
            // Nếu checkbox được chọn, thêm giá trị vào mảng
            newSelectedOptions.push(value);
        } else {
            // Nếu bỏ chọn, xóa giá trị khỏi mảng
            newSelectedOptions = newSelectedOptions.filter(
                (opt) => opt !== value
            );
        }

        // Nối các giá trị thành chuỗi
        const recipeString = newSelectedOptions.join(', ');

        // Cập nhật state
        this.setState({
            selectedOptions: newSelectedOptions,
            recipeString: recipeString || 'None',
        });
    };

    handleCheckboxChangeAll = (event) => {
        const isChecked = event.target.checked;
        let newUnchoosed = [...this.state.unchoosed];
        let newChoosed = [...this.state.choosed];

        if (isChecked) {
            // Chuyển tất cả từ unchoosed sang choosed
            newChoosed = [...this.state.students]; // Dùng students để đảm bảo lấy toàn bộ danh sách
            newUnchoosed = [];
        } else {
            // Chuyển tất cả từ choosed sang unchoosed
            newUnchoosed = [...this.state.students];
            newChoosed = [];
        }

        this.setState({
            isSelectedAll: isChecked,
            unchoosed: newUnchoosed,
            choosed: newChoosed,
        });
    };

    render() {
        var { selectedOptions, recipeString, choosed, unchoosed } = this.state;
        return (
            <div className=''>
                <div className='text_center my-20'>
                    <h1 id='qlsv'>Thông báo tình hình trẻ</h1>
                </div>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <div className='addForm flex'>
                        <div className='mt-11 col-xs-4 col-sm-4 col-md-4 col-lg-4 border border-dark'>
                            <Droppable droppableId='ROOT'>
                                {(provided) => (
                                    <div
                                        className='h-full'
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}>
                                        <div className='flex justify-center items-center p-6 gap-6'>
                                            <span className='fa fa-user'></span>
                                            <span>Danh sách học sinh</span>
                                        </div>
                                        {unchoosed?.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item?.id.toString()}
                                                index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}>
                                                        <p className='border border-dark rounded-md m-2 p-2'>
                                                            {item.name}
                                                        </p>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                        <div className='mt-11 col-xs-4 col-sm-4 col-md-4 col-lg-4'>
                            <div className='panel panel-warning'>
                                <div className='panel-heading'>
                                    <h3 className='panel-title'>
                                        Gửi thông báo
                                    </h3>
                                </div>
                                <div className='panel-body'>
                                    <form onSubmit={this.onSubmit}>
                                        <div className='form-group'>
                                            <label>Buổi:</label>
                                            <select
                                                className='form-control'
                                                name='day'
                                                required
                                                value={this.state.day}
                                                onChange={this.onChange}>
                                                <option>--Select--</option>
                                                <option value='morning'>
                                                    Sáng
                                                </option>
                                                <option value='afternoon'>
                                                    Chiều
                                                </option>
                                            </select>
                                            <label>Tình trạng ăn uống:</label>
                                            <select
                                                className='form-control'
                                                name='eat_status'
                                                required
                                                value={this.state.eat_status}
                                                onChange={this.onChange}>
                                                <option>--Select--</option>
                                                <option value='full'>
                                                    Đầy đủ
                                                </option>
                                                <option value='half-full'>
                                                    Ăn không hết
                                                </option>
                                                <option value='none'>
                                                    Biếng ăn
                                                </option>
                                            </select>
                                            <label>Thực đơn:</label>
                                            <div className='h-full'>
                                                {JSON.parse(
                                                    localStorage.getItem(
                                                        'meals'
                                                    )
                                                )?.map((item) => (
                                                    <div
                                                        className='ml-4 flex gap-4 items-center'
                                                        id='checkbox'
                                                        key={item.id}>
                                                        <input
                                                            id='checkbox'
                                                            type='checkbox'
                                                            value={item.name}
                                                            onChange={
                                                                this
                                                                    .handleCheckboxChange
                                                            }
                                                        />
                                                        {item.name}
                                                    </div>
                                                ))}
                                            </div>
                                            <label>Hoạt động:</label>
                                            <select
                                                className='form-control'
                                                name='subject'
                                                required
                                                value={this.state.subject}
                                                onChange={this.onChange}>
                                                <option>--Select--</option>
                                                {JSON.parse(
                                                    localStorage.getItem(
                                                        'subjects'
                                                    )
                                                )?.map((item) => (
                                                    <option
                                                        key={item.id}
                                                        value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>

                                            <label>Nhận xét: </label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                required
                                                name='note'
                                                value={this.state.note}
                                                onChange={this.onChange}
                                            />
                                            <label>Đánh giá cuối buổi:</label>
                                            <select
                                                className='form-control'
                                                name='review'
                                                required
                                                value={this.state.review}
                                                onChange={this.onChange}>
                                                <option>--Select--</option>
                                                <option value='good'>
                                                    Ngoan
                                                </option>
                                                <option value='bad'>
                                                    Chưa ngoan
                                                </option>
                                            </select>

                                            <div className='mt-3 flex gap-3 items-center'>
                                                <input
                                                    id='checkbox'
                                                    type='checkbox'
                                                    onChange={
                                                        this
                                                            .handleCheckboxChangeAll
                                                    }
                                                />
                                                Gửi hết tới tất cả phụ huynh học
                                                sinh
                                            </div>

                                            <br />
                                            <div className='text_center my-20'>
                                                <button
                                                    type='submit'
                                                    className='button submit btn btn-primary'
                                                    onClick={this.onSubmit}>
                                                    <span className='fa fa-plus'></span>{' '}
                                                    &nbsp;Gửi
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

                        <div className='mt-11 col-xs-4 col-sm-4 col-md-4 col-lg-4 border border-dark'>
                            <Droppable droppableId='ROOT-OUT'>
                                {(provided) => (
                                    <div
                                        className='h-full'
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}>
                                        <div className='flex justify-center items-center p-6 gap-6'>
                                            <span className='fa fa-user'></span>
                                            <span>
                                                Danh sách học sinh đã chọn
                                            </span>
                                        </div>
                                        {choosed?.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item?.id.toString()}
                                                index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}>
                                                        <p className='border border-dark p-2'>
                                                            {item.name}
                                                        </p>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </div>
                </DragDropContext>
            </div>
        );
    }
}

export default Notification;
