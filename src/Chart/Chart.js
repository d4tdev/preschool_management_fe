/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import CallApi from '../API/CallApi';
import moment from 'moment';

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            situationsOld: [],
            situationsNow: [],
        };
    }

    componentDidMount() {
        const parentId = localStorage.getItem('user');
        const oneMonthAgo = moment().subtract(1, 'month').format('MM');
        const oneMonthNow = moment().format('MM');

        CallApi(
            `situation?filters[parent_id]=${parentId}&filters[month]=${oneMonthAgo}`,
            'GET',
            null
        )
            .then((res) => {
                if (res?.data?.data != null) {
                    this.setState({
                        situationsOld: res.data.data,
                    });
                } else {
                    this.setState({
                        situationsOld: [],
                    });
                }
            })
            .catch((err) => {
                console.error('Error fetching situationsOld:', err);
                this.setState({
                    situationsOld: [],
                });
            });

        CallApi(
            `situation?filters[parent_id]=${parentId}&filters[month]=${oneMonthNow}`,
            'GET',
            null
        )
            .then((res) => {
                if (res?.data?.data != null) {
                    this.setState({
                        situationsNow: res.data.data,
                    });
                } else {
                    this.setState({
                        situationsNow: [],
                    });
                }
            })
            .catch((err) => {
                console.error('Error fetching situationsNow:', err);
                this.setState({
                    situationsNow: [],
                });
            });
    }

    render() {
        const { situationsOld, situationsNow } = this.state;

        // Bar Chart: Thống kê ăn uống
        const data_bar_chart_old = [
            { name: 'Đầy đủ', value: 0 },
            { name: 'Ăn không hết', value: 0 },
            { name: 'Biếng ăn', value: 0 },
        ];

        const data_bar_chart = [
            { name: 'Đày đủ', value: 0 },
            { name: 'Ăn không hết', value: 0 },
            { name: 'Biếng ăn', value: 0 },
        ];

        // Pie Chart: Thống kê thái độ
        const data_pie_chart_old = [
            { name: 'Ngoan', count: 0 },
            { name: 'Chưa ngoan', count: 0 },
        ];

        const data_pie_chart = [
            { name: 'Ngoan', count: 0 },
            { name: 'Chưa ngoan', count: 0 },
        ];

        const COLORS = ['#00C49F', '#FF8042']; // Màu xanh cho "Ngoan", cam cho "Chưa ngoan"

        // Xử lý dữ liệu từ API
        situationsOld?.forEach((situation) => {
            if (situation.review === 'good') {
                data_pie_chart_old[0].count += 1;
            } else if (situation.review === 'bad') {
                data_pie_chart_old[1].count += 1;
            }

            if (situation.eat_status === 'full') {
                data_bar_chart_old[0].value += 1;
            } else if (situation.eat_status === 'half-full') {
                data_bar_chart_old[1].value += 1;
            } else if (situation.eat_status === 'none') {
                data_bar_chart_old[2].value += 1;
            }
        });

        situationsNow?.forEach((situation) => {
            if (situation.review === 'good') {
                data_pie_chart[0].count += 1;
            } else if (situation.review === 'bad') {
                data_pie_chart[1].count += 1;
            }

            if (situation.eat_status === 'full') {
                data_bar_chart[0].value += 1;
            } else if (situation.eat_status === 'half-full') {
                data_bar_chart[1].value += 1;
            } else if (situation.eat_status === 'none') {
                data_bar_chart[2].value += 1;
            }
        });

        // Tùy chỉnh nhãn phần trăm trên Pie Chart
        const RADIAN = Math.PI / 180;
        const renderCustom = ({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent,
            index,
        }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
                <text
                    x={x}
                    y={y}
                    fill='white'
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline='central'>
                    {`${(percent * 100).toFixed(0)}%`}
                </text>
            );
        };

        return (
            <div className='w-full'>
                <h1 className='text-center my-5 text-3xl font-bold'>
                    Thống kê tình hình trẻ trong 1 tháng
                </h1>
                <div className='w-3/4 mx-auto mb-5 border border-black rounded-lg'>
                    <h3 className='text-center text-xl font-semibold py-2'>
                        BIỂU ĐỒ ĐÁNH GIÁ THÁI ĐỘ THEO THÁNG{' '}
                        {moment().format('MM/YYYY')}
                    </h3>
                    <div className='max-w-[50%] mx-auto'>
                        <PieChart width={500} height={450}>
                            <Pie
                                data={data_pie_chart}
                                isAnimationActive={true}
                                cx='50%'
                                cy='50%'
                                label={renderCustom}
                                outerRadius={120}
                                fill='#8884d8'
                                dataKey='count'>
                                {data_pie_chart.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>
                </div>
                <div className='w-3/4 mx-auto mb-5 border border-black rounded-lg'>
                    <h3 className='text-center text-xl font-semibold py-2'>
                        BIỂU ĐỒ ĐÁNH GIÁ ĂN UỐNG THEO THÁNG{' '}
                        {moment().format('MM/YYYY')}
                    </h3>
                    <div className='max-w-[90%] mx-auto'>
                        <ComposedChart
                            width={900}
                            height={500}
                            data={data_bar_chart}>
                            <CartesianGrid stroke='#f5f5f5' />
                            <XAxis dataKey='name' scale='band' />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey='value' barSize={50} fill='#413ea0' />
                            <Line
                                type='monotone'
                                dataKey='value'
                                stroke='#ff7300'
                            />
                        </ComposedChart>
                    </div>
                </div>

                <h1 className='text-center my-5 text-3xl font-bold'>
                    Thống kê tình hình trẻ tháng trước
                </h1>
                <div className='w-3/4 mx-auto mb-5 border border-black rounded-lg'>
                    <h3 className='text-center text-xl font-semibold py-2'>
                        BIỂU ĐỒ ĐÁNH GIÁ THÁI ĐỘ THEO THÁNG{' '}
                        {moment().subtract(1, 'month').format('MM/YYYY')}
                    </h3>
                    <div className='max-w-[50%] mx-auto'>
                        <PieChart width={500} height={450}>
                            <Pie
                                data={data_pie_chart_old}
                                isAnimationActive={true}
                                cx='50%'
                                cy='50%'
                                label={renderCustom}
                                outerRadius={120}
                                fill='#8884d8'
                                dataKey='count'>
                                {data_pie_chart_old.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>
                </div>

                <div className='w-3/4 mx-auto mb-5 border border-black rounded-lg'>
                    <h3 className='text-center text-xl font-semibold py-2'>
                        BIỂU ĐỒ ĐÁNH GIÁ ĂN UỐNG THEO THÁNG{' '}
                        {moment().format('MM/YYYY')}
                    </h3>
                    <div className='max-w-[90%] mx-auto'>
                        <ComposedChart
                            width={900}
                            height={500}
                            data={data_bar_chart_old}>
                            <CartesianGrid stroke='#f5f5f5' />
                            <XAxis dataKey='name' scale='band' />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey='value' barSize={50} fill='#413ea0' />
                            <Line
                                type='monotone'
                                dataKey='value'
                                stroke='#ff7300'
                            />
                        </ComposedChart>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chart;
