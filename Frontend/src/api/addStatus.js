import axios from 'axios';

import configuration from '../config/configuration';
const SERVER_URL = configuration.SERVER_URL;

const BASE_URL = `${SERVER_URL}/users`;

export default axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    }
})