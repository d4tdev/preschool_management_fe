import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../../API/CallApi';
import axios from 'axios';
import moment from 'moment';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
class AddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: '',
            description: '',
            fee_date: '',
            students: [],
            unchoosed: [],
            choosed: [],
            isSelected: false,
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
        CallApi('fee', 'POST', {
            amount: this.state.amount,
            description: this.state.description,
            fee_date: moment(this.state.fee_date).format('YYYY-MM-DD'),
            students: this.state.choosed,
            status: 'not_yet',
        });

        this.setState({
            amount: '',
            description: '',
            fee_date: '',
            choosed: [],
            unchoosed: this.state.students,
            isSelected: false,
        });
        // alert('Đã gửi thành công');
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
                    <h1 id='qlsv'>Thông báo học phí</h1>
                </div>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <div className='addForm flex'>
                        <div className='mt-11 col-xs-5 col-sm-5 col-md-5 col-lg-5 border border-dark'>
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

                        <div className='mt-11 col-xs-5 col-sm-5 col-md-5 col-lg-5'>
                            <div className='panel panel-warning'>
                                <div className='panel-heading'>
                                    <h3 className='panel-title'>
                                        Gửi thông báo
                                    </h3>
                                </div>
                                <div className='panel-body'>
                                    <form onSubmit={this.onSubmit}>
                                        <div className='form-group'>
                                            <label>Số tiền cần đóng:</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                required
                                                name='amount'
                                                value={this.state.amount}
                                                onChange={this.onChange}
                                            />
                                            <label>Lí do:</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                required
                                                name='description'
                                                value={this.state.description}
                                                onChange={this.onChange}
                                            />
                                            <label>Hạn nộp:</label>
                                            <input
                                                type='date'
                                                className='form-control'
                                                required
                                                name='fee_date'
                                                value={this.state.fee_date}
                                                onChange={this.onChange}
                                            />
                                            <div className='mt-3 flex gap-3 items-center'>
                                                <input
                                                    id='checkbox'
                                                    type='checkbox'
                                                    onChange={
                                                        this
                                                            .handleCheckboxChange
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

                        <div className='mt-11 col-xs-5 col-sm-5 col-md-5 col-lg-5 border border-dark'>
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

export default AddForm;
