/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { BsClipboardData } from 'react-icons/bs';
import { IoMdNotificationsOutline } from 'react-icons/io';
import logo from './logo1.png';
import home from './home.png';
import '../NavBar.css';
import CallApi from '../../API/CallApi';
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
            <div id='main'>
                <div className='homepage'>
                    <p
                        className='elements justify-center items-center flex gap-2'
                        id='title'>
                        <div className=''>
                            <img className='w-[80px] h-[80px]' src={logo} />
                        </div>
                        TMN<span id='student'>SC1</span>
                    </p>
                    <hr className='elements' id='homehr' />
                    <div className='introduction'>
                        <img className='homewallpaper' src={home} />
                        <h1 className='manage'>
                            Mọi thứ
                            <div id='_manage'>cần thiết cho việc</div> quản lý
                            học sinh
                        </h1>

                        <p id='_intro1'>
                            TMNSC1 là 1 website tiện ích giúp quản lý học sinh
                            Trường mầm non Sơn Cẩm 1 Thái Nguyên
                        </p>

                        <div>
                            Trang facebook chính thức của trường : &nbsp;
                            <a
                                className='text-blue-300 underline'
                                target='_blank'
                                href='https://www.facebook.com/people/Tr%C6%B0%E1%BB%9Dng-M%E1%BA%A7m-non-x%C3%A3-S%C6%A1n-C%E1%BA%A9m-TPTN/100071679531592/'>
                                https://www.facebook.com/people/Trường_mầm_non_xã_Sơn_Cẩm_TPTN
                            </a>
                        </div>
                        <div className='footer1'>
                            <br />
                            <p className='mb-4'>
                                Hàng ngàn tổ chức giáo dục ngày nay sử dụng hệ
                                thống quản lý trường học phân mảnh và nền tảng
                                phần mềm để quản lý các hoạt động hành chính và
                                học tập của họ. Website cung cấp một giải pháp
                                hợp nhất tất cả trong một nền tảng đơn giản và
                                đẹp mắt.
                            </p>
                        </div>

                        {/* FOOTER CHUC NANG */}

                        <div className='footer2'>
                            <hr className='elements' id='homehr' />
                            <h1 id='_footer1'>Các tính năng của TMNSC1</h1>

                            <div className='flex justify-center items-center gap-80'>
                                <div className='flex flex-col justify-center items-center'>
                                    <div className='footer_icons'>
                                        <span className='fa fa-comment-dots'></span>
                                    </div>
                                    <div className='footer_fn' id=''>
                                        Phụ huynh nhận thông báo
                                    </div>
                                </div>
                                <div className='flex flex-col justify-center items-center'>
                                    <div className='footer_icons'>
                                        <span className='fa fa-chart-bar'></span>
                                    </div>
                                    <div className='' id=''>
                                        Theo dõi học phí
                                    </div>
                                </div>
                                <div className='flex flex-col justify-center items-center'>
                                    <div className='footer_icons'>
                                        <BsClipboardData />
                                    </div>
                                    <div className='' id=''>
                                        Quản lý thông tin
                                    </div>
                                </div>
                                <div className='flex flex-col justify-center items-center'>
                                    <div className='footer_icons'>
                                        <IoMdNotificationsOutline />
                                    </div>
                                    <div className='' id=''>
                                        Thông báo tình trẻ
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
