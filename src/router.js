import React from 'react';
import Home from './HomePage/Component/Home';
import Notification from './HomePage/Component/Notification';
import { Chat } from './Chat/Chat';
import ListStudent from './ListStudent/ListStudent';
import Chart from './Chart/Chart';
import AddForm from './ListStudent/Components/AddForm';
import AddFormClassroom from './Classroom/Components/AddForm';
import AddFormFee from './Fee/Components/AddForm';
import AddFormSubject from './Subject/Components/AddForm';
import AddFormMeal from './Meal/Components/AddForm';
import InfoStudent from './ListStudent/Components/InfoStudent';
import ImportData from './ListStudent/Components/ImportData';
import Profile from './Profile/Profile';
import ChangePassword from './Profile/ChangePassword';
import ListClassroom from './Classroom/ListClassroom';
import ListSubject from './Subject/ListSubject';
import InfoClassroom from './Classroom/Components/InfoClassroom';
import ListSituation from './Situation/ListSituation';
import InfoSituation from './Situation/Components/InfoSituation';
import ListFee from './Fee/ListFee';
import ListMeal from './Meal/ListMeal';
import InfoMeal from './Meal/Components/InfoMeal';
import InfoSubject from './Subject/Components/InfoSubject';
import Attendance from './Attendance/Attendance';
import ListAttendance from './Attendance/ListAttendance';

const routes = [
    {
        path: '/home/notification',
        exact: true,
        main: () => <Notification />,
    },

    {
        path: '/home/attendance',
        exact: true,
        main: () => <Attendance />,
    },
    {
        path: '/home/list-fees',
        exact: true,
        main: () => <ListFee />,
    },
    {
        path: '/home/list-situations',
        exact: true,
        main: () => <ListSituation />,
    },
    {
        path: '/home/list-attendances',
        exact: true,
        main: () => <ListAttendance />,
    },
    {
        path: '/home/list-students',
        exact: true,
        main: () => <ListStudent />,
    },
    {
        path: '/home/list-classrooms',
        exact: true,
        main: () => <ListClassroom />,
    },
    {
        path: '/home/list-subjects',
        exact: true,
        main: () => <ListSubject />,
    },
    {
        path: '/home/list-meals',
        exact: true,
        main: () => <ListMeal />,
    },
    {
        path: '/home/chart',
        exact: true,
        main: () => <Chart />,
    },
    {
        path: '/home/list-students/add',
        exact: true,
        main: () => <AddForm />,
    },
    {
        path: '/home/list-classrooms/add',
        exact: true,
        main: () => <AddFormClassroom />,
    },
    {
        path: '/home/list-fees/add',
        exact: true,
        main: () => <AddFormFee />,
    },
    {
        path: '/home/list-subjects/add',
        exact: true,
        main: () => <AddFormSubject />,
    },
    {
        path: '/home/list-meals/add',
        exact: true,
        main: () => <AddFormMeal />,
    },
    {
        path: '/home/list-students/update/:id',
        exact: true,
        main: ({ match }) => <InfoStudent match={match} />,
    },
    {
        path: '/home/list-classrooms/update/:id',
        exact: true,
        main: ({ match }) => <InfoClassroom match={match} />,
    },
    {
        path: '/home/list-subjects/update/:id',
        exact: true,
        main: ({ match }) => <InfoSubject match={match} />,
    },
    {
        path: '/home/list-meals/update/:id',
        exact: true,
        main: ({ match }) => <InfoMeal match={match} />,
    },
    {
        path: '/home/list-situations/update/:id',
        exact: true,
        main: ({ match }) => <InfoSituation match={match} />,
    },
    {
        path: '/home/list-students/import-data',
        exact: true,
        main: () => <ImportData />,
    },
    {
        path: '/home/profile',
        exact: true,
        main: ({ match }) => <Profile match={match} />,
    },
    {
        path: '/home',
        exact: true,
        main: () => <Home />,
    },
    {
        path: '/home/change-password',
        exact: true,
        main: () => <ChangePassword />,
    },
];

export default routes;
