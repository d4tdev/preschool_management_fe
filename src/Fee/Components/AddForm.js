/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../../API/CallApi';
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
            isSelectedAll: false,
            mode: 'click', // Chế độ mặc định là click chọn
            error: null, // Lưu lỗi nếu có
        };
    }

    componentDidMount() {
        // Lấy danh sách học sinh từ API
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

        const { amount, description, fee_date, choosed } = this.state;

        // Validation cơ bản
        if (!amount || !description || !fee_date) {
            this.setState({ error: 'Vui lòng điền đầy đủ thông tin.' });
            return;
        }
        if (choosed.length === 0) {
            this.setState({ error: 'Vui lòng chọn ít nhất một học sinh.' });
            return;
        }

        // Gửi dữ liệu tới API /fee
        CallApi('fee', 'POST', {
            amount: amount,
            description: description,
            fee_date: moment(fee_date).format('YYYY-MM-DD'),
            students: choosed,
            status: 'not_yet',
        })
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    this.setState({
                        amount: '',
                        description: '',
                        fee_date: '',
                        choosed: [],
                        unchoosed: this.state.students,
                        isSelectedAll: false,
                        mode: 'click',
                        error: null,
                    });
                    alert('Đã gửi thông báo học phí thành công!');
                    // Có thể chuyển hướng về danh sách học sinh nếu cần
                    // this.props.history.push('/home/list-students');
                } else {
                    this.setState({
                        error: 'Gửi thông báo học phí thất bại. Vui lòng thử lại.',
                    });
                }
            })
            .catch((err) => {
                console.error('Error adding fee:', err);
                this.setState({
                    error: 'Gửi thông báo học phí thất bại. Vui lòng thử lại.',
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

    handleCheckboxChange = (event) => {
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

    handleModeChange = (event) => {
        this.setState({ mode: event.target.value });
    };

    render() {
        const {
            amount,
            description,
            fee_date,
            choosed,
            unchoosed,
            mode,
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
                        Thông báo học phí
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
                            {/* Thông tin học phí */}
                            <div className='mb-8'>
                                <h3 className='text-2xl font-medium text-gray-700 mb-3'>
                                    Thông tin học phí
                                </h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div>
                                        <label className='block text-lg font-medium text-gray-700 mb-2'>
                                            Số tiền cần đóng:
                                        </label>
                                        <input
                                            type='text'
                                            className='w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg'
                                            name='amount'
                                            value={amount}
                                            onChange={this.onChange}
                                            placeholder='Ví dụ: 500000'
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-lg font-medium text-gray-700 mb-2'>
                                            Hạn nộp:
                                        </label>
                                        <input
                                            type='date'
                                            className='w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg'
                                            name='fee_date'
                                            value={fee_date}
                                            onChange={this.onChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Lí do */}
                            <div className='mb-8'>
                                <h3 className='text-2xl font-medium text-gray-700 mb-3'>
                                    Lí do
                                </h3>
                                <div className='grid grid-cols-1 gap-6'>
                                    <div>
                                        <label className='block text-lg font-medium text-gray-700 mb-2'>
                                            Lí do thu học phí:
                                        </label>
                                        <input
                                            type='text'
                                            className='w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg'
                                            name='description'
                                            value={description}
                                            onChange={this.onChange}
                                            placeholder='Ví dụ: Học phí tháng 10'
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Checkbox gửi tất cả */}
                            <div className='mb-8'>
                                <label className='flex items-center gap-3'>
                                    <input
                                        type='checkbox'
                                        checked={isSelectedAll}
                                        onChange={this.handleCheckboxChange}
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
                                    className='bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 hover:text-white transition text-xl'>
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
                            value={mode}
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

export default AddForm;
