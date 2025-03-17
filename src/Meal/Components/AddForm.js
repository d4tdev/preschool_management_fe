import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CallApi from '../../API/CallApi';

class AddMealForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '', // Chỉ cần trường name cho bữa ăn
        };
    }

    onChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
        });
    };

    onSubmit = (event) => {
        event.preventDefault();

        // Gửi dữ liệu tới API /meal
        CallApi('meal', 'POST', {
            name: this.state.name,
        })
            .then(() => {
                this.setState({
                    name: '', // Reset form sau khi gửi thành công
                });
                alert('Đã thêm bữa ăn thành công');
            })
            .catch((err) => {
                console.error('Error adding meal:', err);
                alert('Thêm bữa ăn thất bại');
            });
    };

    render() {
        return (
            <div className="addForm">
                <div className="back">
                    <Link to="/home/list-meals" className="btn btn-danger">
                        <span className="fa fa-arrow-left"></span>   Quay lại
                    </Link>
                </div>
                <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5 center">
                    <div className="panel panel-warning">
                        <div className="panel-heading">
                            <h3 className="panel-title">Thêm bữa ăn</h3>
                        </div>
                        <div className="panel-body">
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <label>Tên bữa ăn: </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        name="name"
                                        value={this.state.name}
                                        onChange={this.onChange}
                                        placeholder="Ví dụ: Cháo gà"
                                    />
                                    <br />
                                    <div className="text_center my-20">
                                        <button
                                            type="submit"
                                            className="button submit btn btn-primary"
                                        >
                                            <span className="fa fa-plus"></span>   Lưu lại
                                        </button>{' '}
                                        <Link
                                            to="/home/list-meals"
                                            className="button cancel btn btn-primary"
                                        >
                                            <span className="fa fa-close"></span>   Hủy bỏ
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddMealForm;
