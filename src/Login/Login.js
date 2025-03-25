/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import Logo from './logo1.png';
import AppLogo from './home.jpg';
import CallApi from '../API/CallApi';

const Body = styled.div`
    position: relative;
    overflow: hidden;
    height: 100vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 80px;
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 15px;
    }
`;
const Uet_logo = styled.img`
    width: 100px;
    height: 100px;
`;
const App_logo = styled.img`
    width: 400px;
    height: 400px;
    @media (max-width: 768px) {
        width: 250px;
        height: 250px;
    }
`;
const App_logo_container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
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
    max-width: 300px;
    text-align: center;
    font-size: 1.4rem;
    color: rgb(9, 49, 95);
    transition: all 0.3s ease;
    font-weight: bold;
    opacity: 0.6;
    line-height: 2.5rem;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    &:hover {
        opacity: 1;
    }
`;
const Comment1 = styled.p`
    margin: auto;
    max-width: 300px;
    text-align: center;
    font-size: 1.4rem;
    color: rgb(9, 49, 95);
    transition: all 0.3s ease;
    font-weight: bold;
    opacity: 0.6;
    line-height: 2.5rem;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    &:hover {
        opacity: 1;
    }
`;
const Comment2 = styled.p`
    margin: auto;
    max-width: 300px;
    text-align: center;
    font-size: 1.4rem;
    color: rgb(9, 49, 95);
    transition: all 0.3s ease;
    font-weight: bold;
    opacity: 0.6;
    line-height: 2.5rem;
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

        try {
            const res = await CallApi('auth/login', 'POST', {
                email: this.state.email,
                password: this.state.password,
            });

            if (res?.status == 200) {
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

                const classroomRes = await CallApi('classroom', 'GET', null);
                if (classroomRes?.data?.data != null) {
                    localStorage.setItem(
                        'lop',
                        JSON.stringify(classroomRes?.data?.data)
                    );
                }

                if (res?.data?.data.user.role === 'parent') {
                    const feeRes = await CallApi(
                        `fee?filters[parent_id]=${res?.data?.data.user.id}`,
                        'GET',
                        null
                    );
                    if (feeRes?.data?.data != null) {
                        localStorage.setItem(
                            'fee',
                            JSON.stringify(feeRes?.data?.data[0])
                        );
                    }
                }
            } else {
                alert('Sai tên đăng nhập hoặc mật khẩu');
            }
        } catch (error) {
            alert('Sai tên đăng nhập hoặc mật khẩu');
        }
    };

    render() {
        if (this.state.isLogin === true) {
            return <Redirect to='/home' />;
        } else {
            return (
                <Body>
                    <Line1></Line1>
                    <Line2></Line2>

                    {/* Logo ứng dụng và comment */}
                    <App_logo_container>
                        <App_logo src={AppLogo} />
                        <Comment>
                            Hệ thống quản lý và thông báo tình hình trẻ
                        </Comment>
                        <Comment1>
                            cho phụ huynh trường mầm non Sơn Cẩm 1 Thái Nguyên
                        </Comment1>
                        <Comment2>
                            Xây dựng và phát triển bởi Trần Tiến Đạt
                        </Comment2>
                    </App_logo_container>

                    {/* Form đăng nhập */}
                    <form
                        onSubmit={this.submit}
                        className='flex flex-col items-center justify-center w-[450px] h-[500px] bg-white rounded-[60px] shadow-2xl'>
                        <Uet_logo src={Logo} className='mb-6' />
                        <h2 className='text-5xl font-semibold text-[#2573b3] mb-8'>
                            ĐĂNG NHẬP
                        </h2>

                        <div className='w-[80%]'>
                            <div className='mb-6'>
                                <label className='flex items-center gap-2 text-xl font-medium text-[#2573b3] mb-2'>
                                    <FaUser className='text-2xl' />
                                    Email:
                                </label>
                                <input
                                    type='text'
                                    className='w-full p-2 border-b-2 border-[#09599b] focus:outline-none focus:border-[#2573b3] text-xl bg-transparent'
                                    name='email'
                                    placeholder='Email đăng nhập'
                                    value={this.state.email}
                                    onChange={this.handle}
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className='mb-8'>
                                <label className='flex items-center gap-2 text-xl font-medium text-[#2573b3] mb-2'>
                                    <RiLockPasswordFill className='text-2xl' />
                                    Mật khẩu:
                                </label>
                                <input
                                    type='password'
                                    className='w-full p-2 border-b-2 border-[#09599b] focus:outline-none focus:border-[#2573b3] text-xl bg-transparent'
                                    name='password'
                                    placeholder='Mật khẩu'
                                    value={this.state.password}
                                    onChange={this.handle}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type='submit'
                            className='bg-[#2573b3] text-white w-[260px] h-[45px] rounded-[10px] text-2xl hover:bg-[#1a5a8c] transition-all duration-300 hover:shadow-lg'>
                            Đăng nhập
                        </button>
                    </form>
                </Body>
            );
        }
    }
}

export default Login;
