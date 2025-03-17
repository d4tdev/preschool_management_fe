/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../../API/CallApi';
import styled from 'styled-components';
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

class InfoMeal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meal: [],
            id: '',
            name: '',
        };
    }

    componentDidMount() {
        const { match } = this.props;
        if (match) {
            const id = match.params.id;
            CallApi(`meal/${id}`, 'GET', null)
                .then((res) => {
                    const data = res?.data?.data;
                    if (data) {
                        this.setState({
                            meal: data,
                            id: data._id, // Giả sử id là _id từ API
                            name: data.name,
                        });
                    }
                })
                .catch((err) => {
                    console.error('Error fetching meal:', err);
                });
        }
    }

    onChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
        });
    };

    onSubmit = (event) => {
        event.preventDefault();
        const id = this.props.match.params.id;
        CallApi(`meal/${id}`, 'PUT', {
            name: this.state.name,
        })
            .then((res) => {
                if (res.status === 200) {
                    alert('Cập nhật bữa ăn thành công');
                } else {
                    alert('Cập nhật bữa ăn thất bại');
                }
            })
            .catch((err) => {
                console.error('Error updating meal:', err);
                alert('Cập nhật bữa ăn thất bại');
            });
    };

    render() {
        const { meal } = this.state;

        return (
            <Container className='container'>
                <Title>Thông tin chi tiết</Title>
                <Site>
                    <Infor_site>
                        <Title_infor>Thông tin bữa ăn</Title_infor>
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
                                <p style={{ marginTop: '10px' }}>
                                    Tên bữa ăn:{' '}
                                </p>
                                <input
                                    type='text'
                                    name='name'
                                    value={this.state.name}
                                    onChange={this.onChange}
                                    style={{ width: '200px' }}
                                    placeholder={meal.name || 'Nhập tên bữa ăn'}
                                />
                            </Left_div>
                            <Right_div></Right_div>
                        </Infor>
                    </Infor_site>
                </Site>
                <Btn_site>
                    <Link
                        to='/home/list-meals'
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

export default InfoMeal;
