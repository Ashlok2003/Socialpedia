import axios from 'axios';

const BASE_URL = 'http://localhost:3000/users';

export default axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    }
})