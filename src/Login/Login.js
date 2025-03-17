import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import Logo from './logo1.png';
import AppLogo from './home.jpg';
import CallApi from '../API/CallApi';

const Body = styled.div`
    // background-color: rgb(186, 248, 255);
    position: relative;
    overflow: hidden;
    height: 100vh;
`;
const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;
const _Input = styled.input`
    border: 0;
    border-bottom: 2px solid #09599b;
    outline: 0;
    background: transparent;
    width: 100%;
`;
const _Button = styled.button`
    width: 260px;
    margin-left: 70px;
    height: 40px;
    background-color: #2573b3;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.8rem;
    transition: all 0.3s ease;
    opacity: 0.9;
    &:hover {
        opacity: 1;
        box-shadow: 0 4px 8px 4px rgba(0, 0, 0, 0.2),
            0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
`;

const Icon = styled.i`
    padding: 0px 5px 2px 0px;
    border-bottom: 2px solid #09599b;
    margin-left: 18%;
    // margin-right: 5px;
    color: #2573b3;
`;
const Title = styled.p`
    text-align: center;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-weight: 600;
    font-size: 3rem;
    color: #2573b3;
    padding: 20px 0px 20px 0px;
`;
const Title1 = styled.p`
    width: 150px;
    margin: auto;
    text-align: center;
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
    font-size: 1.5rem;
    padding-top: 15px;
    padding-bottom: 15px;
    opacity: 0.8;
    transition: all 0.3s ease;
    &:hover {
        cursor: pointer;
        opacity: 1;
    }
`;
const Form = styled.form`
    width: 400px;
    height: 500px;
    margin-top: 150px;
    background-color: white;
    margin-left: 30%;
    border-radius: 60px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;
const Input_container = styled.div`
    padding: 0 0 10px 0;
`;
const Uet_logo = styled.img`
    width: 80px;
    height: 80px;
    margin-left: 160px;
    margin-top: 30px;
    padding-top: 10px;
`;
const App_logo = styled.img`
    width: 500px;
    height: 500px;
`;
const App_logo_container = styled.div`
    margin: 160px 0 0 150px;
`;
const Form_container = styled.div``;
const Line1 = styled.div`
    top: -11rem;
    left: -6rem;
    position: absolute;
    width: 500px;
    height: 350px;
    border: 4px solid rgb(12, 64, 124);
    border-radius: 50%;
`;
const Line2 = styled.div`
    position: absolute;
    overflow: hidden;
    width: 450px;
    height: 350px;
    border: 4px solid rgb(12, 64, 124);
    border-radius: 50%;
    right: -6.5rem;
    bottom: -6rem;
    opacity: 0.8;
`;
const Comment = styled.p`
    margin: auto;
    max-width: 380px;
    text-align: center;
    font-size: 1.4rem;
    color: rgb(9, 49, 95);
    transition: all 0.3s ease;
    font-weight: bold;
    opacity: 0.6;
    line-height: 3rem;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    &:hover {
        opacity: 1;
    }
`;
const Comment1 = styled.p`
    margin: auto;
    max-width: 380px;
    text-align: center;
    font-size: 1.4rem;
    color: rgb(9, 49, 95);
    transition: all 0.3s ease;
    font-weight: bold;
    opacity: 0.6;
    line-height: 3rem;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    &:hover {
        opacity: 1;
    }
`;
const Comment2 = styled.p`
    margin: auto;
    max-width: 380px;
    text-align: center;
    font-size: 1.4rem;
    color: rgb(9, 49, 95);
    transition: all 0.3s ease;
    font-weight: bold;
    opacity: 0.6;
    line-height: 3rem;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    &:hover {
        opacity: 1;
    }
`;
class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            isLogin: false,
        };
        this.handle = this.handle.bind(this);
        this.submit = this.submit.bind(this);
    }

    handle = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [name]: value,
        });
    };

    submit = async (event) => {
        event.preventDefault();

        await axios
            .post('http://localhost:8000/api/auth/login', {
                email: this.state.email,
                password: this.state.password,
            })
            .then((res) => {
                localStorage.setItem(
                    'accessToken',
                    res?.data?.data.access_token
                );
                localStorage.setItem('role', res?.data?.data.user.role);
                localStorage.setItem('user', res?.data?.data.user.id);
                localStorage.setItem('email', res?.data?.data.user.email);
                localStorage.setItem('classId', res?.data?.data.user.class_id);
                this.setState({
                    isLogin: localStorage.getItem('accessToken') != null,
                });

                CallApi(`classroom`, 'GET', null).then((res) => {
                    if (res?.data?.data != null) {
                        localStorage.setItem(
                            'lop',
                            JSON.stringify(res?.data?.data)
                        );
                    }
                });

                if (res?.data?.data.user.role === 'parent') {
                    CallApi(
                        `fee?filters[parent_id]=${res?.data?.data.user.id}`,
                        'GET',
                        null
                    ).then((res) => {
                        if (res?.data?.data != null) {
                            localStorage.setItem(
                                'fee',
                                JSON.stringify(res?.data?.data[0])
                            );
                        }
                    });
                }
            })
            .catch(function (error) {
                alert('Sai tên đăng nhập hoặc mật khẩu');
            });
    };

    render() {
        if (this.state.isLogin === true) {
            return <Redirect to='/home' />;
        } else {
            return (
                <Body>
                    <Line1></Line1>
                    <Line2></Line2>
                    <Container>
                        <App_logo_container>
                            <App_logo src={AppLogo} />
                            <Comment>
                                Hệ thống quản lý và thông báo tình hình trẻ
                            </Comment>
                            <Comment1>
                                cho phụ huynh trường mầm non Sơn Cẩm 1 Thái
                                Nguyên
                            </Comment1>
                            <Comment2>
                                Xây dựng và phát triển bởi Trần Tiến Đạt
                            </Comment2>
                        </App_logo_container>
                        <Form_container>
                            <Form
                                action=''
                                method='post'
                                onSubmit={this.submit}>
                                <Uet_logo src={Logo} />
                                <Title>ĐĂNG NHẬP</Title>
                                <div className='flex flex-col justify-center ml-2'>
                                    <Input_container>
                                        <Icon>
                                            <FaUser />
                                        </Icon>
                                        <_Input
                                            type='text'
                                            required
                                            name='email'
                                            placeholder='Email đăng nhập'
                                            value={this.state.email}
                                            onChange={this.handle}
                                            autoFocus
                                        />
                                    </Input_container>
                                    <br />
                                    <Input_container>
                                        <Icon>
                                            <RiLockPasswordFill />
                                        </Icon>
                                        <_Input
                                            type='password'
                                            name='password'
                                            placeholder='Mật khẩu'
                                            // value={this.state.password}

                                            onChange={this.handle}></_Input>
                                    </Input_container>
                                </div>
                                <br />
                                {/* <Title1>Quên mật khẩu?</Title1> */}
                                <_Button onClick={this.submit}>
                                    Đăng nhập
                                </_Button>
                                <br />
                            </Form>
                        </Form_container>
                    </Container>
                </Body>
            );
        }
    }
}

export default Login;
