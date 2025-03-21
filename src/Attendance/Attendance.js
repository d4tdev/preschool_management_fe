import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import CallApi from '../API/CallApi';
import moment from 'moment';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

class Attendance extends Component {
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
            arrived: [],
            left: [],
            selectedOptions: [],
            recipeString: '',
            isSelectedAll: false,
            mode: 'click',
        };

        CallApi(
            `student?filters[class_id]=${localStorage.getItem('classId')}`,
            'GET',
            null
        ).then((res) => {
            if (res?.data?.data != null) {
                const students = res.data.data;
                this.setState({ students });

                CallApi(
                    `attendance?filters[class_id]=${localStorage.getItem(
                        'classId'
                    )}&filters[date]=${moment().format('YYYY-MM-DD')}`,
                    'GET',
                    null
                ).then((attendanceRes) => {
                    if (attendanceRes?.data?.data != null) {
                        const attendanceData = attendanceRes.data.data;

                        const arrived = [];
                        const left = [];
                        const unchoosed = [];

                        students.forEach((student) => {
                            const attendance = attendanceData.find(
                                (record) => record.student_id.id === student.id
                            );
                            if (attendance) {
                                if (
                                    attendance.arrived_at &&
                                    !attendance.left_at
                                ) {
                                    arrived.push(student);
                                } else if (attendance.left_at) {
                                    left.push(student);
                                } else {
                                    unchoosed.push(student);
                                }
                            } else {
                                unchoosed.push(student);
                            }
                        });

                        this.setState({ unchoosed, arrived, left });
                    } else {
                        this.setState({ unchoosed: students });
                    }
                });
            } else {
                this.setState({ students: [] });
            }
        });
    }

    onChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
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
            students: [...this.state.arrived, ...this.state.left],
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
            arrived: [],
            left: [],
            selectedOptions: [],
            recipeString: '',
            isSelectedAll: false,
        });
        alert('Đã gửi thông báo thành công');
    };

    onDragEnd = async (result) => {
        const { destination, source } = result;
        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        )
            return;

        const unchoosed = [...this.state.unchoosed];
        const arrived = [...this.state.arrived];
        const left = [...this.state.left];
        let student;

        if (source.droppableId === 'UNCHOOSED') {
            student = unchoosed[source.index];
            if (destination.droppableId !== 'ARRIVED') {
                alert('Chỉ có thể chuyển từ "Chưa chọn" sang "Đã đến"!');
                return;
            }
        } else if (source.droppableId === 'ARRIVED') {
            student = arrived[source.index];
            if (destination.droppableId !== 'LEFT') {
                alert('Chỉ có thể chuyển từ "Đã đến" sang "Đã về"!');
                return;
            }
        } else if (source.droppableId === 'LEFT') {
            student = left[source.index];
            alert('Không thể chuyển học sinh từ "Đã về" sang cột khác!');
            return;
        }

        const destinationColumn =
            destination.droppableId === 'ARRIVED' ? 'Đã đến' : 'Đã về';
        const confirmMove = window.confirm(
            `Bạn có chắc chắn muốn chuyển "${student.name}" sang cột "${destinationColumn}" không?`
        );

        if (!confirmMove) return;

        if (source.droppableId === 'UNCHOOSED') {
            unchoosed.splice(source.index, 1);
        } else if (source.droppableId === 'ARRIVED') {
            arrived.splice(source.index, 1);
        }

        if (destination.droppableId === 'ARRIVED') {
            arrived.splice(destination.index, 0, student);
        } else if (destination.droppableId === 'LEFT') {
            left.splice(destination.index, 0, student);
        }

        this.setState({ unchoosed, arrived, left });

        const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const currentDate = moment().format('YYYY-MM-DD');
        try {
            if (destination.droppableId === 'LEFT') {
                await CallApi(`attendance`, 'POST', {
                    student_id: student.id,
                    date: currentDate,
                    left_at:
                        destination.droppableId === 'LEFT' ? currentTime : null,
                    status:
                        destination.droppableId === 'ARRIVED'
                            ? 'arrived'
                            : 'left',
                });
            }

            if (destination.droppableId === 'ARRIVED') {
                await CallApi(`attendance`, 'POST', {
                    student_id: student.id,
                    date: currentDate,
                    arrived_at:
                        destination.droppableId === 'ARRIVED'
                            ? currentTime
                            : null,
                    status:
                        destination.droppableId === 'ARRIVED'
                            ? 'arrived'
                            : 'left',
                });
            }

            console.log(`Gọi API thành công cho học sinh ${student.id}`);
        } catch (error) {
            console.error(`Lỗi khi gọi API cho học sinh ${student.id}:`, error);
        }
    };

    handleClickSelect = async (student, fromList) => {
        const unchoosed = [...this.state.unchoosed];
        const arrived = [...this.state.arrived];
        const left = [...this.state.left];

        let confirmMove = true;
        let destinationColumn = '';

        if (fromList === 'unchoosed') {
            if (arrived.includes(student) || left.includes(student)) return;
            destinationColumn = 'Đã đến';
            confirmMove = window.confirm(
                `Bạn có chắc chắn muốn chuyển "${student.name}" sang cột "${destinationColumn}" không?`
            );
            if (confirmMove) {
                const index = unchoosed.findIndex(
                    (item) => item.id === student.id
                );
                if (index !== -1) {
                    unchoosed.splice(index, 1);
                    arrived.push(student);
                }
            }
        } else if (fromList === 'arrived') {
            if (left.includes(student)) return;
            destinationColumn = 'Đã về';
            confirmMove = window.confirm(
                `Bạn có chắc chắn muốn chuyển "${student.name}" sang cột "${destinationColumn}" không?`
            );
            if (confirmMove) {
                const index = arrived.findIndex(
                    (item) => item.id === student.id
                );
                if (index !== -1) {
                    arrived.splice(index, 1);
                    left.push(student);
                }
            }
        } else if (fromList === 'left') {
            alert('Không thể chuyển học sinh từ "Đã về" sang cột khác!');
            return;
        }

        if (confirmMove) {
            this.setState({ unchoosed, arrived, left });

            const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
            const currentDate = moment().format('YYYY-MM-DD');
            try {
                if (destinationColumn === 'Đã về') {
                    await CallApi(`attendance`, 'POST', {
                        student_id: student.id,
                        date: currentDate,
                        left_at: currentTime,
                        status: 'left',
                    });
                } else if (destinationColumn === 'Đã đến') {
                    await CallApi(`attendance`, 'POST', {
                        student_id: student.id,
                        date: currentDate,
                        arrived_at: currentTime,
                        status: 'arrived',
                    });
                }
                console.log(`Gọi API thành công cho học sinh ${student.id}`);
            } catch (error) {
                console.error(
                    `Lỗi khi gọi API cho học sinh ${student.id}:`,
                    error
                );
            }
        }
    };

    handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        let newSelectedOptions = [...this.state.selectedOptions];
        if (checked) {
            newSelectedOptions.push(value);
        } else {
            newSelectedOptions = newSelectedOptions.filter(
                (opt) => opt !== value
            );
        }
        const recipeString = newSelectedOptions.join(', ');
        this.setState({
            selectedOptions: newSelectedOptions,
            recipeString: recipeString || 'None',
        });
    };

    handleCheckboxChangeAll = (event) => {
        const isChecked = event.target.checked;
        let newUnchoosed = [...this.state.unchoosed];
        let newArrived = [...this.state.arrived];
        let newLeft = [...this.state.left];

        if (isChecked) {
            newArrived = [...this.state.students];
            newUnchoosed = [];
            newLeft = [];
        } else {
            newUnchoosed = [...this.state.students];
            newArrived = [];
            newLeft = [];
        }

        this.setState({
            isSelectedAll: isChecked,
            unchoosed: newUnchoosed,
            arrived: newArrived,
            left: newLeft,
        });
    };

    handleModeChange = (event) => {
        this.setState({ mode: event.target.value });
    };

    render() {
        const { unchoosed, arrived, left, mode } = this.state;

        return (
            <div
                className='min-h-screen p-6 bg-cover bg-center bg-no-repeat relative'
                style={{
                    backgroundImage: `url('http://mnphuchau.edu.vn/upload/21715/fck/hanoi-mnphuchau/2024_08_02_23_29_1143.jpg')`,
                }}>
                {/* Lớp phủ mờ */}
                <div className='absolute inset-0 bg-black opacity-50'></div>

                {/* Nội dung chính */}
                <div className='relative z-10'>
                    {/* Tiêu đề */}
                    <h1 className='text-5xl font-bold text-center text-white mb-10'>
                        Điểm danh trẻ ngày {moment().format('DD/MM/YYYY')}
                    </h1>

                    {/* Chọn chế độ */}
                    <div className='max-w-full mx-auto mb-6'>
                        <label className='text-xl font-medium text-white mr-4'>
                            Chọn chế độ:
                        </label>
                        <select
                            value={this.state.mode}
                            onChange={this.handleModeChange}
                            className='p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base'>
                            <option value='click'>Click chọn</option>
                            <option value='drag'>Kéo thả</option>
                        </select>
                    </div>

                    {/* Danh sách học sinh */}
                    {mode === 'drag' ? (
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <div className='max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
                                {/* Danh sách chưa chọn */}
                                <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full min-h-[350px] max-h-[650px]'>
                                    <h3 className='text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-3'>
                                        <span className='fa fa-user text-xl'></span>{' '}
                                        Danh sách chưa chọn
                                    </h3>
                                    <Droppable droppableId='UNCHOOSED'>
                                        {(provided) => (
                                            <div
                                                className='min-h-[300px] max-h-[550px] overflow-y-auto'
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}>
                                                {unchoosed?.map(
                                                    (item, index) => (
                                                        <Draggable
                                                            key={item.id}
                                                            draggableId={item?.id.toString()}
                                                            index={index}>
                                                            {(provided) => (
                                                                <div
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className='p-4 mb-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 text-xl'>
                                                                    {item.name}
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    )
                                                )}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>

                                {/* Danh sách đã đến */}
                                <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full min-h-[350px] max-h-[650px]'>
                                    <h3 className='text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-3'>
                                        <span className='fa fa-user text-xl'></span>{' '}
                                        Danh sách đã đến
                                    </h3>
                                    <Droppable droppableId='ARRIVED'>
                                        {(provided) => (
                                            <div
                                                className='min-h-[300px] max-h-[550px] overflow-y-auto'
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}>
                                                {arrived?.map((item, index) => (
                                                    <Draggable
                                                        key={item.id}
                                                        draggableId={item?.id.toString()}
                                                        index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className='p-4 mb-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 text-xl'>
                                                                {item.name}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>

                                {/* Danh sách đã về */}
                                <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full min-h-[350px] max-h-[650px]'>
                                    <h3 className='text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-3'>
                                        <span className='fa fa-user text-xl'></span>{' '}
                                        Danh sách đã về
                                    </h3>
                                    <Droppable droppableId='LEFT'>
                                        {(provided) => (
                                            <div
                                                className='min-h-[300px] max-h-[550px] overflow-y-auto'
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}>
                                                {left?.map((item, index) => (
                                                    <Draggable
                                                        key={item.id}
                                                        draggableId={item?.id.toString()}
                                                        index={index}
                                                        isDragDisabled={true}>
                                                        {(provided) => (
                                                            <div
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className='p-4 mb-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 text-xl'>
                                                                {item.name}
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
                    ) : (
                        <div className='max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
                            {/* Danh sách chưa chọn */}
                            <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full min-h-[350px] max-h-[650px]'>
                                <h3 className='text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-3'>
                                    <span className='fa fa-user text-xl'></span>{' '}
                                    Danh sách chưa chọn
                                </h3>
                                <div className='min-h-[300px] max-h-[550px] overflow-y-auto'>
                                    {unchoosed?.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() =>
                                                this.handleClickSelect(
                                                    item,
                                                    'unchoosed'
                                                )
                                            }
                                            className='p-4 mb-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer text-xl'>
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Danh sách đã đến */}
                            <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full min-h-[350px] max-h-[650px]'>
                                <h3 className='text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-3'>
                                    <span className='fa fa-user text-xl'></span>{' '}
                                    Danh sách đã đến
                                </h3>
                                <div className='min-h-[300px] max-h-[550px] overflow-y-auto'>
                                    {arrived?.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() =>
                                                this.handleClickSelect(
                                                    item,
                                                    'arrived'
                                                )
                                            }
                                            className='p-4 mb-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer text-xl'>
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Danh sách đã về */}
                            <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full min-h-[350px] max-h-[650px]'>
                                <h3 className='text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-3'>
                                    <span className='fa fa-user text-xl'></span>{' '}
                                    Danh sách đã về
                                </h3>
                                <div className='min-h-[300px] max-h-[550px] overflow-y-auto'>
                                    {left?.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() =>
                                                this.handleClickSelect(
                                                    item,
                                                    'left'
                                                )
                                            }
                                            className='p-4 mb-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer text-xl'>
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Attendance;
