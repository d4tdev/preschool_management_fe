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
    justify-content: center;
    margin-top: 10%;
`;
const Btn_site = styled.div`
    position: static;
    margin-top: 5vh;
    text-align: center;
`;

const Container = styled.div``;

class InfoStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: [],
            first_name: '',
            last_name: '',
            id: '',
            name: '',
            birthday: '',
            gender: '',
            parent: '', // Hiển thị name của parent
            parent_id: '', // Lưu id để gửi API
            class: '', // Hiển thị name của class
            class_id: '', // Lưu id để gửi API
        };
    }

    componentDidMount() {
        const { match } = this.props;
        if (match) {
            const id = match.params.id;
            CallApi(`student/${id}`, 'GET', null).then((res) => {
                const data = res?.data?.data;
                console.log(data);
                this.setState({
                    student: data,
                    id: data.id,
                    name: data.name,
                    birthday: data.birthday,
                    gender: data.gender,
                    parent: data.parent_id.name,
                    parent_id: data.parent_id.id,
                    class: data.class_id.name,
                    class_id: data.class_id.id,
                    first_name: data.first_name,
                    last_name: data.last_name,
                });
            });
        }
    }

    onChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value; // value là id từ option

        const parents = JSON.parse(localStorage.getItem('parents')) || [];
        const classes = JSON.parse(localStorage.getItem('lop')) || [];

        if (name === 'parent') {
            const selectedParent = parents.find((p) => p.id == value);
            this.setState({
                parent: selectedParent
                    ? selectedParent.name
                    : this.state.parent,
                parent_id: +value,
            });
        } else if (name === 'class') {
            const selectedClass = classes.find((c) => c.id == value);
            this.setState({
                class: selectedClass ? selectedClass.name : this.state.class,
                class_id: +value,
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
        CallApi(`student/${id}`, 'PUT', {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            birthday: this.state.birthday,
            gender: this.state.gender,
            parent_id: this.state.parent_id, // Gửi id
            class_id: this.state.class_id, // Gửi id
        })
            .then((res) => {
                alert('Cập nhật thành công');
            })
            .catch((err) => {
                console.error('Error updating student:', err);
                alert('Cập nhật thất bại');
            });
    };

    render() {
        const { student, parent, class: className } = this.state;

        const parents = JSON.parse(localStorage.getItem('parents')) || [];
        const classes = JSON.parse(localStorage.getItem('lop')) || [];

        return (
            <Container className='container'>
                <Title>Thông tin chi tiết</Title>
                <Site>
                    <Infor_site>
                        <Title_infor>Thông tin cá nhân</Title_infor>
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
                                <p style={{ marginTop: '10px' }}>Họ : </p>
                                <input
                                    type='text'
                                    name='first_name'
                                    placeholder={student.first_name}
                                    onChange={this.onChange}
                                    style={{ width: '150px' }}
                                />
                                <p style={{ marginTop: '10px' }}>Tên: </p>
                                <input
                                    type='text'
                                    name='last_name'
                                    placeholder={student.last_name}
                                    onChange={this.onChange}
                                    style={{ width: '150px' }}
                                />
                                <p style={{ marginTop: '10px' }}>Ngày sinh:</p>
                                <input
                                    type='text'
                                    name='birthday'
                                    placeholder={moment(
                                        student.birthday
                                    ).format('DD/MM/YYYY')}
                                    onChange={this.onChange}
                                    style={{ width: '150px' }}
                                />
                                <p style={{ marginTop: '10px' }}>Giới tính:</p>
                                <input
                                    type='text'
                                    name='gender'
                                    placeholder={student.gender}
                                    onChange={this.onChange}
                                    style={{ width: '150px' }}
                                />
                            </Left_div>
                            <Right_div>
                                <p>Phụ huynh:</p>
                                <select
                                    className='form-control'
                                    name='parent'
                                    required
                                    value={this.state.parent_id} // Value là id
                                    onChange={this.onChange}>
                                    <option value='' disabled hidden>
                                        {parent || 'Chọn phụ huynh'}
                                    </option>
                                    {parents.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                <p style={{ marginTop: '10px' }}>Lớp: </p>
                                <select
                                    className='form-control'
                                    name='class'
                                    required
                                    value={this.state.class_id} // Value là id
                                    onChange={this.onChange}>
                                    <option value='' disabled hidden>
                                        {className || 'Chọn lớp'}
                                    </option>
                                    {classes.map((item) => (
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
                        to='/home/list-students'
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

export default InfoStudent;
