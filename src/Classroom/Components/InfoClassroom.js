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
    margin-top: 5%;
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
    max-width: 35%;
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

class InfoClassroom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classroom: [],
            id: '',
            name: '',
            teacher: '', // Hiển thị name của teacher
            teacher_id: '', // Lưu id để gửi API
        };
    }
    componentDidMount() {
        const { match } = this.props;
        if (match) {
            const id = match.params.id;
            CallApi(`classroom/${id}`, 'GET', null).then((res) => {
                const data = res?.data?.data;
                this.setState({
                    classroom: data,
                    id: data.id,
                    name: data.name,
                    teacher: data.teacher_id.name,
                    teacher_id: data.teacher_id.id,
                });
            });
        }
    }

    onChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value; // value là id từ option

        const teachers = JSON.parse(localStorage.getItem('teachers')) || [];

        if (name === 'teacher') {
            const selectedTeacher = teachers.find((t) => t.id === value);
            this.setState({
                teacher: selectedTeacher
                    ? selectedTeacher.name
                    : this.state.teacher,
                teacher_id: value,
            });
        } else {
            this.setState({
                [name]: value,
            });
        }
    };

    onSubmit = (event) => {
        event.preventDefault();
        const id = this.props.match.params.id;
        CallApi(`classroom/${id}`, 'PUT', {
            name: this.state.name,
            teacher_id: this.state.teacher_id, // Gửi teacher_id thay vì teacher
        })
            .then((res) => {
                alert('Cập nhật thành công');
            })
            .catch((err) => {
                console.error('Error updating classroom:', err);
                alert('Cập nhật thất bại');
            });
    };

    render() {
        const { classroom, teacher } = this.state;

        const teachers = JSON.parse(localStorage.getItem('teachers')) || [];

        return (
            <Container className='container'>
                <Title>Thông tin chi tiết</Title>
                <Site>
                    <Infor_site>
                        <Title_infor>Thông tin lớp học</Title_infor>
                        <Infor>
                            <Image_div>
                                <img
                                    className='avatar'
                                    src={bg_link}
                                    width='150px'
                                    height='150px'
                                />
                            </Image_div>
                            <Left_div>
                                <p style={{ marginTop: '10px' }}>Tên: </p>
                                <input
                                    type='text'
                                    name='name'
                                    placeholder={classroom.name}
                                    onChange={this.onChange}
                                    style={{ width: '150px' }}
                                />
                            </Left_div>
                            <Right_div>
                                <p>Giáo viên:</p>
                                <select
                                    className='form-control'
                                    name='teacher'
                                    required
                                    value={this.state.teacher_id} // Value là id
                                    onChange={this.onChange}>
                                    <option value='' disabled hidden>
                                        {teacher || 'Chọn giáo viên'}
                                    </option>
                                    {teachers.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </Right_div>
                        </Infor>
                    </Infor_site>
                </Site>
                <Btn_site>
                    <Link
                        to='/home/list-classrooms'
                        className='goback btn btn-danger'
                        style={{ marginRight: '20px' }}>
                        <span className='fa fa-arrow-left'></span>   Quay lại
                    </Link>
                    <button
                        type='submit'
                        className='btn btn-primary'
                        style={{ marginRight: '20px' }}
                        onClick={this.onSubmit}>
                        <span className='fa fa-save'></span>   Ghi nhận
                    </button>
                </Btn_site>
            </Container>
        );
    }
}

export default InfoClassroom;
