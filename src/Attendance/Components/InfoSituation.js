/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../../API/CallApi';
import styled from 'styled-components';
import moment from 'moment';
import '../../index.css';
import bg_link from './avatar.png';

const Title = styled.h2`
    text-align: center;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    text-shadow: 2px 7px 5px rgba(0, 0, 0, 0.3);
    font-size: 5rem;
    font-weight: bolder;
    color: #0b5592;
`;
const Infor_site = styled.div`
    background-color: white;
    padding: 2rem 3rem;
    width: 60%;
    box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.2),
        8px 8px 8px 8px rgba(0, 0, 0, 0.19);
    border-radius: 10px;
    background-color: whitesmoke;
`;
const Infor = styled.div`
    display: flex;
`;
const Left_div = styled.div`
    padding-right: 10px;
    padding-left: 10px;
    max-width: 100%;
`;
const Right_div = styled.div`
    padding-right: 10px;
    padding-left: 10px;
    max-width: 35%;
    margin-left: 2rem;
`;
const Image_div = styled.div`
    padding-top: 30px;
`;
const Title_infor = styled.p`
    font-size: 2.5rem;
    width: 60%;
    margin: auto;
    padding-bottom: 20px;
    text-align: center;
    font-weight: bold;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    // text-shadow: 2px 7px 5px rgba(0, 0, 0, 0.3),
    //   0px -4px 10px rgba(255, 255, 255, 0.3);
`;
const Title_gpa = styled.p`
    font-size: 2.5rem;
    // width: 50%;
    // margin: auto;
    padding-bottom: 20px;
    font-weight: bold;
    //text-align: center;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    // text-shadow: 2px 7px 5px rgba(0, 0, 0, 0.3),
    //   0px -4px 10px rgba(255, 255, 255, 0.3);
`;
const Gpa_site = styled.div`
    // border: 1px solid black;
    background-color: whitesmoke;
    border-radius: 10px;
    width: 40%;
    padding: 2rem 3rem;
    margin-left: 5%;
    height: 50vh;
    align-items: center;
    box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.2),
        8px 8px 8px 8px rgba(0, 0, 0, 0.19);
    text-align: center;
`;
const Site = styled.div`
    display: flex;
    margin-top: 10%;
    justify-content: center;
`;
const Btn_site = styled.div`
    position: static;
    margin-top: 5vh;
    text-align: center;
`;

const Container = styled.div``;
class InfoSituation extends Component {
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
            created_at: '',
            teacher_phone: '',
            teacher_name: '',
            situations: [],
        };
    }

    componentDidMount() {
        var { match } = this.props;
        if (match) {
            var id = match.params.id;
            CallApi(`situation/${id}`, 'GET', null).then((res) => {
                var data = res?.data?.data;
                this.setState({
                    day: data.day,
                    note: data.note,
                    review: data.review,
                    eat_status: data.eat_status,
                    recipe: data.recipe,
                    subject: data.subject_id.name,
                    subject_id: data.subject_id.id,
                    created_at: data.created_at,
                    teacher_phone: data.student_id.class_id.teacher_id.phone,
                    teacher_name: data.student_id.class_id.teacher_id.name,
                });
            });
        }
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
        var id = this.props.match.params.id;
        CallApi(`situation/${id}`, 'PUT', {
            name: this.state.name,
            teacher: this.state.teacher,
        }).then((res) => {
            alert('Cập nhật thành công');
        });
    };

    render() {
        var { situation } = this.state;

        return (
            <Container
                className='w-full h-[100vh] mx-auto py-[10%] px-[10%] bg-cover bg-center bg-no-repeat'
                style={{
                    backgroundImage:
                        'url("https://i.pinimg.com/originals/d0/37/3c/d0373ccf3e773b74ed82648e765cca67.jpg")',
                }}>
                <div className='w-[75%] mx-auto'>
                    <Title>Thông tin chi tiết</Title>
                    <Site>
                        <Infor_site className='!w-full flex flex-col justify-center items-center'>
                            <Title_infor>
                                Thông tin chi tiết của trẻ buổi{' '}
                                <span className='text-sky-600'>
                                    {this.state.day == 'morning'
                                        ? 'sáng'
                                        : 'chiều'}
                                </span>{' '}
                                ngày{' '}
                                {moment(this.state.created_at).format(
                                    'DD/MM/YYYY'
                                )}
                            </Title_infor>
                            <Infor className='gap-24'>
                                <Image_div>
                                    <img
                                        className='avatar'
                                        src={bg_link}
                                        width='150px'
                                        height='150px'
                                    />
                                </Image_div>
                                <Left_div>
                                    <span className='font-bold text-2xl'>
                                        Tình trạng ăn uống:{' '}
                                    </span>
                                    <div className='mt-1 flex items-center gap-3'>
                                        <p>Trạng thái: </p>
                                        <p>
                                            {this.state.eat_status == 'full'
                                                ? 'Đầy đủ'
                                                : this.state.eat_status ==
                                                  'half-full'
                                                ? 'Ăn không hết'
                                                : 'Lười ăn'}
                                        </p>
                                    </div>
                                    <div className='mt-1 flex items-center gap-3'>
                                        <p>Thực đơn: </p>
                                        <p>{this.state.recipe}</p>
                                    </div>
                                    <div className='mt-3 flex items-center gap-3'>
                                        <span className='font-bold text-2xl'>
                                            Hoạt động trong buổi:{' '}
                                        </span>
                                        <p>{this.state.subject}</p>
                                    </div>
                                    <div className='mt-3'>
                                        <span className='font-bold text-2xl'>
                                            Nhận xét của giáo viên:{' '}
                                        </span>
                                        <p>{this.state.note}</p>
                                    </div>
                                    <div className='mt-3 flex items-center gap-3'>
                                        <span className='font-bold text-2xl'>
                                            Đánh giá cuối buổi:{' '}
                                        </span>
                                        <p>
                                            {this.state.review == 'good'
                                                ? 'Ngoan'
                                                : 'Chưa ngoan'}
                                        </p>
                                    </div>
                                </Left_div>
                                {/* <Right_div>
                                <p>Giáo viên:</p>
                                <select
                                    className='form-control'
                                    name='teacher'
                                    required
                                    value={this.state.teacher}
                                    onChange={this.onChange}>
                                    <option>{this.state.teacher}</option>
                                    {JSON.parse(
                                        localStorage.getItem('teachers')
                                    ).map((item) => {
                                        if (item.id !== this.state.teacher_id) {
                                            return (
                                                <option
                                                    key={item.id}
                                                    value={item.id}>
                                                    {item.name}
                                                </option>
                                            );
                                        }
                                    })}
                                </select>
                            </Right_div> */}
                            </Infor>
                            <h3 className='mt-4 flex gap-3 items-center'>
                                <p className=' font-bold text-2xl'>
                                    Số điện thoại của giáo viên:
                                </p>{' '}
                                {this.state.teacher_phone} {' - '}(thầy/cô:{' '}
                                {this.state.teacher_name})
                            </h3>
                            <h4 className='mt-2'>
                                Nếu có thắc mắc, hay muốn trao đổi đến giáo viên
                                của bé, vui lòng liên hệ qua số điện thoại của
                                giáo viên !
                            </h4>
                        </Infor_site>
                    </Site>
                    <Btn_site>
                        <Link
                            to='/home/list-situations'
                            className='goback btn btn-danger'
                            style={{ marginRight: '20px' }}>
                            <span className='fa fa-arrow-left'></span> &nbsp;
                            Quay lại
                        </Link>
                        <button
                            type='submit'
                            className='btn btn-primary'
                            style={{ marginRight: '20px' }}
                            onClick={this.onSubmit}>
                            <span className='fa fa-save'></span> &nbsp; Ghi nhận
                        </button>
                    </Btn_site>
                </div>
            </Container>
        );
    }
}
export default InfoSituation;
