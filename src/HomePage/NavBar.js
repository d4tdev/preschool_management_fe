/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import './NavBar.css';
import 'boxicons';
import { AiOutlineHome } from 'react-icons/ai';
import { BsClipboardData } from 'react-icons/bs';
import { IoMdCalendar, IoMdNotificationsOutline } from 'react-icons/io';
import { BiLogOut } from 'react-icons/bi';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory,
} from 'react-router-dom';
import routes from '../router';
import { Redirect } from 'react-router';
class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: '',
            openNav: true,
            chooseHome: true,
            chooseNoti: false,
            chooseChart: false,
            chooseList: false,
            chooseFees: false,
            chooseInfoTeacher: false,
            chooseProfile: false,
            chooseListClassroom: false,
            chooseListSubject: false,
            chooseListMeal: false,
            chooseAttendance: false,
            chooseListAttendance: false,
        };
    }

    componentDidMount() {
        this.setState({
            role: localStorage.getItem('role'),
        });
    }

    open = () => {
        this.setState({
            openNav: !this.state.openNav,
        });
    };

    chooseHome = () => {
        this.setState({
            chooseHome: true,
            chooseNoti: false,
            chooseChart: false,
            chooseList: false,
            chooseFees: false,
            chooseInfoTeacher: false,
            chooseProfile: false,
            chooseListClassroom: false,
            chooseListSubject: false,
            chooseListMeal: false,
            chooseAttendance: false,
            chooseListAttendance: false,
        });
    };

    chooseNoti = () => {
        this.setState({
            chooseHome: false,
            chooseNoti: true,
            chooseChart: false,
            chooseList: false,
            chooseFees: false,
            chooseInfoTeacher: false,
            chooseProfile: false,
            chooseListClassroom: false,
            chooseListSubject: false,
            chooseListMeal: false,
            chooseAttendance: false,
            chooseListAttendance: false,
        });
    };

    chooseChart = () => {
        this.setState({
            chooseHome: false,
            chooseNoti: false,
            chooseChart: true,
            chooseList: false,
            chooseFees: false,
            chooseInfoTeacher: false,
            chooseProfile: false,
            chooseListClassroom: false,
            chooseListSubject: false,
            chooseListMeal: false,
            chooseAttendance: false,
            chooseListAttendance: false,
        });
    };

    chooseList = () => {
        this.setState({
            chooseHome: false,
            chooseNoti: false,
            chooseChart: false,
            chooseList: true,
            chooseFees: false,
            chooseInfoTeacher: false,
            chooseProfile: false,
            chooseListClassroom: false,
            chooseListSubject: false,
            chooseListMeal: false,
            chooseAttendance: false,
            chooseListAttendance: false,
        });
    };

    chooseListClassroom = () => {
        this.setState({
            chooseHome: false,
            chooseNoti: false,
            chooseChart: false,
            chooseList: false,
            chooseFees: false,
            chooseInfoTeacher: false,
            chooseProfile: false,
            chooseListClassroom: true,
            chooseListSubject: false,
            chooseListMeal: false,
            chooseAttendance: false,
            chooseListAttendance: false,
        });
    };

    chooseListSubject = () => {
        this.setState({
            chooseHome: false,
            chooseNoti: false,
            chooseChart: false,
            chooseList: false,
            chooseFees: false,
            chooseInfoTeacher: false,
            chooseProfile: false,
            chooseListClassroom: false,
            chooseListSubject: true,
            chooseListMeal: false,
            chooseAttendance: false,
            chooseListAttendance: false,
        });
    };

    chooseFees = () => {
        this.setState({
            chooseHome: false,
            chooseNoti: false,
            chooseChart: false,
            chooseList: false,
            chooseFees: true,
            chooseInfoTeacher: false,
            chooseProfile: false,
            chooseListClassroom: false,
            chooseListSubject: false,
            chooseListMeal: false,
            chooseAttendance: false,
            chooseListAttendance: false,
        });
    };

    chooseListMeal = () => {
        this.setState({
            chooseHome: false,
            chooseNoti: false,
            chooseChart: false,
            chooseList: false,
            chooseFees: false,
            chooseInfoTeacher: false,
            chooseProfile: false,
            chooseListClassroom: false,
            chooseListSubject: false,
            chooseListMeal: true,
        });
    };

    chooseProfile = () => {
        this.setState({
            chooseHome: false,
            chooseNoti: false,
            chooseChart: false,
            chooseList: false,
            chooseFees: false,
            chooseInfoTeacher: false,
            chooseProfile: true,
            chooseListClassroom: false,
            chooseListSubject: false,
            chooseListMeal: false,
            chooseAttendance: false,
            chooseListAttendance: false,
        });
    };

    chooseLogout = (e) => {
        e.preventDefault();
        // this.setState({
        //   chooseHome: false,
        //   chooseNoti: false,
        //   chooseChart: false,
        //   chooseList: false,
        //   chooseFees: false,
        //   chooseInfoTeacher: false,
        //   chooseProfile: false,
        // });
        // remove all local storage
        localStorage.clear();

        this.props.history.push('/login');
    };

    chooseInfoTeacher = () => {
        this.setState({
            chooseHome: false,
            chooseNoti: false,
            chooseChart: false,
            chooseList: false,
            chooseFees: false,
            chooseInfoTeacher: true,
            chooseProfile: false,
            chooseListClassroom: false,
            chooseListSubject: false,
            chooseListMeal: false,
            chooseAttendance: false,
            chooseListAttendance: false,
        });
    };

    chooseAttendance = () => {
        this.setState({
            chooseHome: false,
            chooseNoti: false,
            chooseChart: false,
            chooseList: false,
            chooseFees: false,
            chooseInfoTeacher: false,
            chooseProfile: false,
            chooseListClassroom: false,
            chooseListSubject: false,
            chooseListMeal: false,
            chooseAttendance: true,
            chooseListAttendance: false,
        });
    };

    chooseListAttendance = () => {
        this.setState({
            chooseHome: false,
            chooseNoti: false,
            chooseChart: false,
            chooseList: false,
            chooseFees: false,
            chooseInfoTeacher: false,
            chooseProfile: false,
            chooseListClassroom: false,
            chooseListSubject: false,
            chooseListMeal: false,
            chooseAttendance: false,
            chooseListAttendance: true,
        });
    };

    render() {
        if (localStorage.getItem('accessToken') == null) {
            return <Redirect to='/login' />;
        }
        var {
            role,
            openNav,
            chooseHome,
            chooseNoti,
            chooseChart,
            chooseList,
            chooseFees,
            chooseInfoTeacher,
            chooseProfile,
            chooseListClassroom,
            chooseListSubject,
            chooseListMeal,
            chooseAttendance,
            chooseListAttendance,
        } = this.state;
        return (
            <Router>
                <section className='body !z-50'>
                    <div className={openNav ? 'sidebar open' : 'sidebar'}>
                        <div className='logo-details'>
                            {/* cai 3 gach */}
                            <div className='logo_name'>MENU</div>
                            <div id='btn' onClick={this.open}>
                                <box-icon
                                    name='menu'
                                    color='#ffffff'></box-icon>
                            </div>
                        </div>
                        <ul className='nav-list'>
                            <li
                                className={chooseHome ? 'home' : ''}
                                onClick={this.chooseHome}>
                                <Link to='/home'>
                                    <div className='icon'>
                                        <AiOutlineHome />
                                    </div>
                                    <span className='links_name'>
                                        Trang chủ
                                    </span>
                                </Link>
                                <span className='tooltip'>Trang chủ</span>
                            </li>
                            {localStorage.getItem('role') === 'teacher' ? (
                                <div>
                                    <li
                                        className={chooseNoti ? 'home' : ''}
                                        onClick={this.chooseNoti}>
                                        <Link to='/home/notification'>
                                            {/* thong bao */}
                                            <div className='icon'>
                                                <IoMdNotificationsOutline />
                                            </div>
                                            <span className='links_name'>
                                                Thông báo về trẻ
                                            </span>
                                        </Link>
                                        <span className='tooltip'>
                                            Thông báo về trẻ
                                        </span>
                                    </li>
                                    <li
                                        className={
                                            chooseAttendance ? 'home' : ''
                                        }
                                        onClick={this.chooseAttendance}>
                                        <Link to='/home/attendance'>
                                            {/* thong bao */}
                                            <div className='icon'>
                                                <IoMdCalendar />
                                            </div>
                                            <span className='links_name'>
                                                Điểm danh trẻ
                                            </span>
                                        </Link>
                                        <span className='tooltip'>
                                            Điểm danh trẻ
                                        </span>
                                    </li>
                                </div>
                            ) : null}
                            {localStorage.getItem('role') === 'parent' ? (
                                <div>
                                    <li
                                        id='bangdiem'
                                        className={
                                            (chooseList ? 'home' : '') +
                                            (role === 'student'
                                                ? 'student'
                                                : '')
                                        }
                                        onClick={this.chooseList}>
                                        <Link to='/home/list-situations'>
                                            {/* danh sach sinh vien */}
                                            <div className='icon'>
                                                <IoMdNotificationsOutline />
                                            </div>
                                            <span className='links_name'>
                                                Thông báo về trẻ
                                            </span>
                                        </Link>
                                        <span className='tooltip'>
                                            Thông báo về trẻ
                                        </span>
                                    </li>
                                    <li
                                        id='bangdiem'
                                        className={
                                            (chooseListAttendance
                                                ? 'home'
                                                : '') +
                                            (role === 'student'
                                                ? 'student'
                                                : '')
                                        }
                                        onClick={this.chooseListAttendance}>
                                        <Link to='/home/list-attendances'>
                                            {/* danh sach sinh vien */}
                                            <div className='icon'>
                                                <IoMdCalendar />
                                            </div>
                                            <span className='links_name'>
                                                Điểm danh hàng ngay
                                            </span>
                                        </Link>
                                        <span className='tooltip'>
                                            Điểm danh hàng ngay
                                        </span>
                                    </li>
                                </div>
                            ) : null}
                            {localStorage.getItem('role') === 'admin' ? (
                                <div>
                                    <li
                                        id='bangdiem'
                                        className={
                                            (chooseList ? 'home' : '') +
                                            (role === 'student'
                                                ? 'student'
                                                : '')
                                        }
                                        onClick={this.chooseList}>
                                        <Link to='/home/list-students'>
                                            {/* danh sach sinh vien */}
                                            <div className='icon'>
                                                <BsClipboardData />
                                            </div>
                                            <span className='links_name'>
                                                Danh sách trẻ
                                            </span>
                                        </Link>
                                        <span className='tooltip'>
                                            Danh sách trẻ
                                        </span>
                                    </li>
                                    <li
                                        id='bangdiem'
                                        className={
                                            (chooseListClassroom
                                                ? 'home'
                                                : '') +
                                            (role === 'student'
                                                ? 'student'
                                                : '')
                                        }
                                        onClick={this.chooseListClassroom}>
                                        <Link to='/home/list-classrooms'>
                                            {/* danh sach sinh vien */}
                                            <div className='icon'>
                                                <BsClipboardData />
                                            </div>
                                            <span className='links_name'>
                                                Danh sách lớp học
                                            </span>
                                        </Link>
                                        <span className='tooltip'>
                                            Danh sách lớp học
                                        </span>
                                    </li>
                                    <li
                                        id='bangdiem'
                                        className={
                                            (chooseListSubject ? 'home' : '') +
                                            (role === 'student'
                                                ? 'student'
                                                : '')
                                        }
                                        onClick={this.chooseListSubject}>
                                        <Link to='/home/list-subjects'>
                                            <div className='icon'>
                                                <BsClipboardData />
                                            </div>
                                            <span className='links_name'>
                                                Danh sách môn học
                                            </span>
                                        </Link>
                                        <span className='tooltip'>
                                            Danh sách môn học
                                        </span>
                                    </li>
                                    <li
                                        id='bangdiem'
                                        className={
                                            (chooseListMeal ? 'home' : '') +
                                            (role === 'student'
                                                ? 'student'
                                                : '')
                                        }
                                        onClick={this.chooseListMeal}>
                                        <Link to='/home/list-meals'>
                                            {/* danh sach sinh vien */}
                                            <div className='icon'>
                                                <BsClipboardData />
                                            </div>
                                            <span className='links_name'>
                                                Danh sách bữa ăn
                                            </span>
                                        </Link>
                                        <span className='tooltip'>
                                            Danh sách bữa ăn
                                        </span>
                                    </li>
                                </div>
                            ) : null}
                            {/* {localStorage.getItem('role') !== 'parent' ? ( */}
                            <div>
                                <li
                                    id='chart'
                                    className={
                                        (chooseFees ? 'home' : '') +
                                        (role === 'student' ? 'student' : '')
                                    }
                                    onClick={this.chooseFees}>
                                    <Link to='/home/list-fees'>
                                        <div className='icon'>
                                            <span className='fa fa-chart-bar'></span>
                                        </div>
                                        <span className='links_name'>
                                            {localStorage.getItem('role') ==
                                            'admin'
                                                ? 'Quản lý học phí'
                                                : 'Thông báo học phí'}
                                        </span>
                                    </Link>
                                    <span className='tooltip'>
                                        {localStorage.getItem('role') == 'admin'
                                            ? 'Quản lý học phí'
                                            : 'Thông báo học phí'}
                                    </span>
                                </li>
                            </div>
                            {/* ) : null} */}
                            {localStorage.getItem('role') === 'parent' ? (
                                <div>
                                    {/* <li
                                        id='chart'
                                        className={
                                            (chooseFees ? 'home' : '') +
                                            (role === 'student'
                                                ? 'student'
                                                : '')
                                        }
                                        onClick={this.chooseFees}>
                                        <Link to='/home/fee'>
                                            <div className='icon'>
                                                <span className='fa fa-chart-bar'></span>
                                            </div>
                                            <span className='links_name'>
                                                Thông báo học phí
                                            </span>
                                        </Link>
                                        <span className='tooltip'>
                                            Thông báo học phí
                                        </span>
                                    </li> */}
                                    <li
                                        id='chart'
                                        className={
                                            (chooseChart ? 'home' : '') +
                                            (role === 'student'
                                                ? 'student'
                                                : '')
                                        }
                                        onClick={this.chooseChart}>
                                        <Link to='/home/chart'>
                                            <div className='icon'>
                                                <span className='fa fa-chart-bar'></span>
                                            </div>
                                            <span className='links_name'>
                                                Thống kê về bé
                                            </span>
                                        </Link>
                                        <span className='tooltip'>
                                            Thông báo về bé
                                        </span>
                                    </li>
                                </div>
                            ) : null}
                            <li
                                className='profile'
                                className={
                                    (chooseProfile ? 'home' : '') +
                                    (role === 'student' ? '' : 'student')
                                }
                                onClick={this.chooseProfile}>
                                <Link to='/home/profile'>
                                    <div className='icon'>
                                        <span className='fa fa-id-card'></span>{' '}
                                    </div>
                                    <span className='links_name'>Hồ sơ</span>

                                    <span className='tooltip'>Hồ sơ</span>
                                </Link>
                            </li>
                            <li className='logout' onClick={this.chooseLogout}>
                                <a to='/' href='/'>
                                    <div className='icon'>
                                        <BiLogOut />
                                    </div>
                                    <span className='links_name'>
                                        Đăng Xuất
                                    </span>
                                </a>
                                <span className='tooltip'>Đăng Xuất</span>
                            </li>
                        </ul>
                    </div>
                    <div className={openNav ? 'nav_open' : 'nav_close'}>
                        <div>{this.show(routes)}</div>
                    </div>
                </section>
            </Router>
        );
    }

    show = (routes) => {
        var result = null;
        if (routes.length > 0) {
            result = routes.map((route, index) => {
                return (
                    <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        component={route.main}
                    />
                );
            });
        }
        return <Switch>{result}</Switch>;
    };
}

export default NavBar;
