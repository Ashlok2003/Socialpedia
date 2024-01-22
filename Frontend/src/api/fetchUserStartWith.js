/* eslint-disable react-refresh/only-export-components */
import axios from 'axios';

const fetchUserStartWith = async (name) => {
    
    const BASE_URL = `http://localhost:3000/fetchUserStartWith/${name}?page=1`;

    const axiosInstance = axios.create({
        baseURL: BASE_URL,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    try {
        const response = await axiosInstance.get();
        
        return response.data;

    } catch (error) {
        console.error("Error Fetching user Data", error);
        throw error;
    }
}

export default fetchUserStartWith;
