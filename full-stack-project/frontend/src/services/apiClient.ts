import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api', // Adjust the base URL as needed
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to handle GET requests
export const get = async (url: string) => {
    const response = await apiClient.get(url);
    return response.data;
};

// Function to handle POST requests
export const post = async (url: string, data: any) => {
    const response = await apiClient.post(url, data);
    return response.data;
};

// Function to handle PUT requests
export const put = async (url: string, data: any) => {
    const response = await apiClient.put(url, data);
    return response.data;
};

// Function to handle DELETE requests
export const del = async (url: string) => {
    const response = await apiClient.delete(url);
    return response.data;
};