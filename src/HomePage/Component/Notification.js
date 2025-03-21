/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import CallApi from '../../API/CallApi';
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
            unchoosedMeals: [], // Danh sách thực đơn chưa chọn
            choosedMeals: [], // Danh sách thực đơn đã chọn
            recipeString: '',
            isSelectedAll: false,
            mode: 'click',
            error: null, // Lưu lỗi nếu có
        };
    }

    componentDidMount() {
        // Tải danh sách học sinh
        CallApi(
            `student?filters[class_id]=${localStorage.getItem('classId')}`,
            'GET',
            null
        )
            .then((res) => {
                if (res?.data?.data != null) {
                    this.setState({
                        students: res.data.data,
                        unchoosed: res.data.data,
                    });
                } else {
                    this.setState({
                        students: [],
                        unchoosed: [],
                    });
                }
            })
            .catch((err) => {
                console.error('Error fetching students:', err);
                this.setState({
                    students: [],
                    unchoosed: [],
                });
            });

        // Tải danh sách thực đơn từ localStorage
        const meals = JSON.parse(localStorage.getItem('meals')) || [];
        this.setState({ unchoosedMeals: meals });
    }

    onChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
            error: null, // Xóa lỗi khi người dùng thay đổi input
        });
    };

    onSubmit = (event) => {
        event.preventDefault();

        const {
            day,
            note,
            review,
            eat_status,
            subject,
            choosed,
            recipeString,
        } = this.state;

        // Validation cơ bản
        if (!day || !note || !review || !eat_status || !subject) {
            this.setState({ error: 'Vui lòng điền đầy đủ thông tin.' });
            return;
        }
        if (choosed.length === 0) {
            this.setState({ error: 'Vui lòng chọn ít nhất một học sinh.' });
            return;
        }

        // Gửi dữ liệu tới API /situation
        CallApi('situation', 'POST', {
            day: day,
            note: note,
            review: review,
            eat_status: eat_status,
            recipe: recipeString || 'None',
            subject_id: subject,
            students: choosed,
        })
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
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
                        unchoosedMeals:
                            JSON.parse(localStorage.getItem('meals')) || [],
                        choosedMeals: [],
                        recipeString: '',
                        isSelectedAll: false,
                        mode: 'click',
                        error: null,
                    });
                    alert('Đã gửi thông báo thành công!');
                    // Có thể chuyển hướng về danh sách học sinh nếu cần
                    // this.props.history.push('/home/list-students');
                } else {
                    this.setState({
                        error: 'Gửi thông báo thất bại. Vui lòng thử lại.',
                    });
                }
            })
            .catch((err) => {
                console.error('Error sending notification:', err);
                this.setState({
                    error: 'Gửi thông báo thất bại. Vui lòng thử lại.',
                });
            });
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
        const unchoosed = [...this.state.unchoosed];
        const choosed = [...this.state.choosed];

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

        this.setState({
            unchoosed,
            choosed,
            isSelectedAll: choosed.length === this.state.students.length,
        });
    };

    handleStudentClick = (student, fromList) => {
        let newUnchoosed = [...this.state.unchoosed];
        let newChoosed = [...this.state.choosed];

        if (fromList === 'unchoosed') {
            // Chuyển từ unchoosed sang choosed
            newUnchoosed = newUnchoosed.filter(
                (item) => item.id !== student.id
            );
            newChoosed.push(student);
        } else {
            // Chuyển từ choosed sang unchoosed
            newChoosed = newChoosed.filter((item) => item.id !== student.id);
            newUnchoosed.push(student);
        }

        this.setState({
            unchoosed: newUnchoosed,
            choosed: newChoosed,
            isSelectedAll: newChoosed.length === this.state.students.length,
        });
    };

    handleMealSelect = (meal, fromList) => {
        const unchoosedMeals = [...this.state.unchoosedMeals];
        const choosedMeals = [...this.state.choosedMeals];

        if (fromList === 'unchoosedMeals') {
            const index = unchoosedMeals.findIndex(
                (item) => item.id === meal.id
            );
            if (index !== -1) {
                unchoosedMeals.splice(index, 1);
                choosedMeals.push(meal);
            }
        } else {
            const index = choosedMeals.findIndex((item) => item.id === meal.id);
            if (index !== -1) {
                choosedMeals.splice(index, 1);
                unchoosedMeals.push(meal);
            }
        }

        // Cập nhật recipeString dựa trên danh sách thực đơn đã chọn
        const recipeString =
            choosedMeals.map((meal) => meal.name).join(', ') || 'None';
        this.setState({ unchoosedMeals, choosedMeals, recipeString });
    };

    handleCheckboxChangeAll = (event) => {
        const isChecked = event.target.checked;
        let newUnchoosed = [];
        let newChoosed = [];

        if (isChecked) {
            // Chuyển tất cả từ unchoosed sang choosed
            newChoosed = [...this.state.students];
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

    handleModeChange = (event) => {
        this.setState({ mode: event.target.value });
    };

    render() {
        const {
            unchoosed,
            choosed,
            mode,
            unchoosedMeals,
            choosedMeals,
            isSelectedAll,
            error,
        } = this.state;

        return (
            <div
                className='min-h-screen p-8 bg-cover bg-center bg-no-repeat relative'
                style={{
                    backgroundImage: `url('http://mnphuchau.edu.vn/upload/21715/fck/hanoi-mnphuchau/2024_08_02_23_29_1143.jpg')`,
                }}>
                {/* Lớp phủ mờ */}
                <div className='absolute inset-0 bg-black opacity-50'></div>

                {/* Nội dung chính */}
                <div className='relative z-10'>
                    {/* Tiêu đề */}
                    <h1 className='text-5xl font-bold text-center text-white mb-10'>
                        Thông báo tình hình trẻ
                    </h1>

                    {/* Form gửi thông báo */}
                    <div className='max-w-6xl mx-auto bg-white bg-opacity-90 p-8 rounded-lg shadow-lg mb-10'>
                        <h2 className='text-4xl font-semibold text-gray-800 mb-6'>
                            Gửi thông báo
                        </h2>

                        {error && (
                            <div className='mb-8 p-4 bg-red-100 text-red-700 rounded-md text-center text-xl'>
                                {error}
                            </div>
                        )}

                        <form onSubmit={this.onSubmit}>
                            {/* Thông tin buổi học */}
                            <div className='mb-8'>
                                <h3 className='text-2xl font-medium text-gray-700 mb-3'>
                                    Thông tin buổi học
                                </h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div>
                                        <label className='block text-lg font-medium text-gray-700 mb-2'>
                                            Buổi:
                                        </label>
                                        <select
                                            className='w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg'
                                            name='day'
                                            required
                                            value={this.state.day}
                                            onChange={this.onChange}>
                                            <option value=''>--Chọn--</option>
                                            <option value='morning'>
                                                Sáng
                                            </option>
                                            <option value='afternoon'>
                                                Chiều
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className='block text-lg font-medium text-gray-700 mb-2'>
                                            Hoạt động:
                                        </label>
                                        <select
                                            className='w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg'
                                            name='subject'
                                            required
                                            value={this.state.subject}
                                            onChange={this.onChange}>
                                            <option value=''>--Chọn--</option>
                                            {JSON.parse(
                                                localStorage.getItem('subjects')
                                            )?.map((item) => (
                                                <option
                                                    key={item.id}
                                                    value={item.id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Tình trạng ăn uống */}
                            <div className='mb-8'>
                                <h3 className='text-2xl font-medium text-gray-700 mb-3'>
                                    Tình trạng ăn uống
                                </h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div>
                                        <label className='block text-lg font-medium text-gray-700 mb-2'>
                                            Tình trạng:
                                        </label>
                                        <select
                                            className='w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg'
                                            name='eat_status'
                                            required
                                            value={this.state.eat_status}
                                            onChange={this.onChange}>
                                            <option value=''>--Chọn--</option>
                                            <option value='full'>Đầy đủ</option>
                                            <option value='half-full'>
                                                Ăn không hết
                                            </option>
                                            <option value='none'>
                                                Biếng ăn
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className='block text-lg font-medium text-gray-700 mb-2'>
                                            Thực đơn:
                                        </label>
                                        <div className='grid grid-cols-2 gap-4'>
                                            {/* Danh sách thực đơn chưa chọn */}
                                            <div className='bg-gray-100 p-4 rounded-lg'>
                                                <h4 className='text-base font-semibold text-gray-700 mb-2'>
                                                    Danh sách thực đơn
                                                </h4>
                                                <div className='max-h-[150px] overflow-y-auto'>
                                                    {unchoosedMeals?.map(
                                                        (item) => (
                                                            <div
                                                                key={item.id}
                                                                onClick={() =>
                                                                    this.handleMealSelect(
                                                                        item,
                                                                        'unchoosedMeals'
                                                                    )
                                                                }
                                                                className='p-2 mb-1 bg-white border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer text-base'>
                                                                {item.name}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            {/* Danh sách thực đơn đã chọn */}
                                            <div className='bg-gray-100 p-4 rounded-lg'>
                                                <h4 className='text-base font-semibold text-gray-700 mb-2'>
                                                    Thực đơn đã chọn
                                                </h4>
                                                <div className='max-h-[150px] overflow-y-auto'>
                                                    {choosedMeals?.map(
                                                        (item) => (
                                                            <div
                                                                key={item.id}
                                                                onClick={() =>
                                                                    this.handleMealSelect(
                                                                        item,
                                                                        'choosedMeals'
                                                                    )
                                                                }
                                                                className='p-2 mb-1 bg-white border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer text-base'>
                                                                {item.name}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Nhận xét và đánh giá */}
                            <div className='mb-8'>
                                <h3 className='text-2xl font-medium text-gray-700 mb-3'>
                                    Nhận xét và đánh giá
                                </h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div>
                                        <label className='block text-lg font-medium text-gray-700 mb-2'>
                                            Nhận xét:
                                        </label>
                                        <input
                                            type='text'
                                            className='w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg'
                                            required
                                            name='note'
                                            value={this.state.note}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-lg font-medium text-gray-700 mb-2'>
                                            Đánh giá cuối buổi:
                                        </label>
                                        <select
                                            className='w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg'
                                            name='review'
                                            required
                                            value={this.state.review}
                                            onChange={this.onChange}>
                                            <option value=''>--Chọn--</option>
                                            <option value='good'>Ngoan</option>
                                            <option value='bad'>
                                                Chưa ngoan
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Checkbox gửi tất cả */}
                            <div className='mb-8'>
                                <label className='flex items-center gap-3'>
                                    <input
                                        type='checkbox'
                                        checked={isSelectedAll}
                                        onChange={this.handleCheckboxChangeAll}
                                        className='h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                                    />
                                    <span className='text-lg font-medium text-gray-700'>
                                        Gửi tới tất cả phụ huynh học sinh
                                    </span>
                                </label>
                            </div>

                            {/* Nút hành động */}
                            <div className='flex justify-center gap-6'>
                                <button
                                    type='submit'
                                    className='bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition text-xl'>
                                    <span className='fa fa-plus mr-2'></span>Gửi
                                </button>
                                <Link
                                    to='/home/list-students'
                                    className='bg-gray-500 text-white px-8 py-3 rounded-md hover:bg-gray-600 transition text-xl'>
                                    <span className='fa fa-close mr-2'></span>
                                    Hủy bỏ
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* Chọn chế độ */}
                    <div className='max-w-full mx-auto mb-6'>
                        <label className='text-2xl font-medium text-white mr-4'>
                            Chọn chế độ:
                        </label>
                        <select
                            value={this.state.mode}
                            onChange={this.handleModeChange}
                            className='p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg'>
                            <option value='click'>Click chọn</option>
                            <option value='drag'>Kéo thả</option>
                        </select>
                    </div>

                    {/* Danh sách trẻ và trẻ đã chọn */}
                    {mode === 'drag' ? (
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <div className='max-w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8'>
                                {/* Danh sách trẻ */}
                                <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full min-h-[400px] max-h-[650px]'>
                                    <h3 className='text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-3'>
                                        <span className='fa fa-user text-xl'></span>{' '}
                                        Danh sách trẻ
                                    </h3>
                                    <Droppable droppableId='ROOT'>
                                        {(provided) => (
                                            <div
                                                className='min-h-[350px] max-h-[550px] overflow-y-auto'
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

                                {/* Danh sách trẻ đã chọn */}
                                <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full min-h-[400px] max-h-[650px]'>
                                    <h3 className='text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-3'>
                                        <span className='fa fa-user text-xl'></span>{' '}
                                        Danh sách trẻ đã chọn
                                    </h3>
                                    <Droppable droppableId='ROOT-OUT'>
                                        {(provided) => (
                                            <div
                                                className='min-h-[350px] max-h-[550px] overflow-y-auto'
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}>
                                                {choosed?.map((item, index) => (
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
                            </div>
                        </DragDropContext>
                    ) : (
                        <div className='max-w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8'>
                            {/* Danh sách trẻ */}
                            <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full min-h-[400px] max-h-[650px]'>
                                <h3 className='text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-3'>
                                    <span className='fa fa-user text-xl'></span>{' '}
                                    Danh sách trẻ
                                </h3>
                                <div className='min-h-[350px] max-h-[550px] overflow-y-auto'>
                                    {unchoosed?.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() =>
                                                this.handleStudentClick(
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

                            {/* Danh sách trẻ đã chọn */}
                            <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full min-h-[400px] max-h-[650px]'>
                                <h3 className='text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-3'>
                                    <span className='fa fa-user text-xl'></span>{' '}
                                    Danh sách trẻ đã chọn
                                </h3>
                                <div className='min-h-[350px] max-h-[550px] overflow-y-auto'>
                                    {choosed?.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() =>
                                                this.handleStudentClick(
                                                    item,
                                                    'choosed'
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

export default Notification;
