import axios from 'axios';
import * as Config from './Config';

export default function CallApi(endpoint, method = 'GET', body) {
    return axios({
        method: method,
        url: `${Config.API_URL}/${endpoint}`,
        data: body,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    }).catch((err) => {
        console.log(err);
    });
}
