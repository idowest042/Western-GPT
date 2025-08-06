import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'development'
    ? 'http://localhost:3000/api'
    : 'https://western-gpt.vercel.app/api',
  withCredentials: true // ✅ send cookies
});
