import axios from 'axios';

import configuration from '../config/configuration';
const SERVER_URL = configuration.SERVER_URL;

export default axios.create({
    baseURL: SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})