/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { BsClipboardData } from 'react-icons/bs';
import { IoMdNotificationsOutline } from 'react-icons/io';
import CallApi from '../../API/CallApi';
import home from './home.png';
import logo from './logo1.png';

export default class Home extends Component {
    componentDidMount() {
        CallApi(`subject`, 'GET', null).then((res) => {
            if (res?.data?.data != null) {
                localStorage.setItem(
                    'subjects',
                    JSON.stringify(res?.data?.data)
                );
            }
        });
        CallApi(`meal`, 'GET', null).then((res) => {
            if (res?.data?.data != null) {
                localStorage.setItem('meals', JSON.stringify(res?.data?.data));
            }
        });
    }

    render() {
        return (
            <div className='min-h-screen bg-gray-100'>
                {/* Nội dung chính */}
                <div className='relative'>
                    {/* Tiêu đề và logo */}
                    <div className='max-w-full mx-auto p-8'>
                        <div className='flex justify-center items-center gap-4 mb-8'>
                            <img
                                className='w-[60px] h-[60px] rounded-full shadow-lg'
                                src={logo}
                                alt='Logo TMNSC1'
                            />
                            <h1 className='text-6xl font-bold text-gray-800'>
                                TMN<span className='text-blue-600'>SC1</span>
                            </h1>
                        </div>
                        <hr className='border-t-2 border-gray-300 w-1/2 mx-auto mb-10' />
                    </div>

                    {/* Phần giới thiệu */}
                    <div className='max-w-6xl mx-auto p-8 text-center'>
                        <img
                            className='w-max-w-6xl object-cover rounded-lg shadow-lg mb-8'
                            src={home}
                            alt='Home Wallpaper'
                        />
                        <h1 className='text-5xl font-bold text-gray-800 mb-4'>
                            Mọi thứ{' '}
                            <span className='block text-blue-600'>
                                cần thiết cho việc
                            </span>{' '}
                            quản lý trẻ
                        </h1>
                        <p className='text-2xl text-gray-600 mb-6'>
                            TMNSC1 là một website tiện ích giúp quản lý trẻ
                            Trường mầm non Sơn Cẩm 1 Thái Nguyên
                        </p>
                        <div className='text-xl text-gray-600 mb-6'>
                            Trang Facebook chính thức của trường:
                            <a
                                className='text-blue-600 underline hover:text-blue-700 transition'
                                target='_blank'
                                rel='noopener noreferrer'
                                href='https://www.facebook.com/people/Tr%C6%B0%E1%BB%9Dng-M%E1%BA%A7m-non-x%C3%A3-S%C6%A1n-C%E1%BA%A9m-TPTN/100071679531592/'>
                                https://www.facebook.com/people/Trường_mầm_non_xã_Sơn_Cẩm_TPTN
                            </a>
                        </div>
                        <div className='text-xl text-gray-600 mb-10'>
                            <p>
                                Hàng ngàn tổ chức giáo dục ngày nay sử dụng hệ
                                thống quản lý trường học phân mảnh và nền tảng
                                phần mềm để quản lý các hoạt động hành chính và
                                học tập của họ. Website cung cấp một giải pháp
                                hợp nhất tất cả trong một nền tảng đơn giản và
                                đẹp mắt.
                            </p>
                        </div>
                    </div>

                    {/* Phần tính năng */}
                    <div className='max-w-7xl mx-auto p-8'>
                        <hr className='border-t-2 border-gray-300 w-1/2 mx-auto mb-10' />
                        <h1 className='text-5xl font-bold text-center text-gray-800 mb-12'>
                            Các tính năng của TMNSC1
                        </h1>
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-10'>
                            <div className='flex flex-col justify-center items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition'>
                                <div className='text-6xl text-blue-600 mb-4'>
                                    <span className='fa fa-comment-dots'></span>
                                </div>
                                <div className='text-2xl font-semibold text-gray-700'>
                                    Phụ huynh nhận thông báo
                                </div>
                            </div>
                            <div className='flex flex-col justify-center items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition'>
                                <div className='text-6xl text-blue-600 mb-4'>
                                    <span className='fa fa-chart-bar'></span>
                                </div>
                                <div className='text-2xl font-semibold text-gray-700'>
                                    Theo dõi học phí
                                </div>
                            </div>
                            <div className='flex flex-col justify-center items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition'>
                                <div className='text-6xl text-blue-600 mb-4'>
                                    <BsClipboardData />
                                </div>
                                <div className='text-2xl font-semibold text-gray-700'>
                                    Quản lý thông tin
                                </div>
                            </div>
                            <div className='flex flex-col justify-center items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition'>
                                <div className='text-6xl text-blue-600 mb-4'>
                                    <IoMdNotificationsOutline />
                                </div>
                                <div className='text-2xl font-semibold text-gray-700'>
                                    Thông báo tình trẻ
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
