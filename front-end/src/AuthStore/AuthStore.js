import {create} from 'zustand';
import { axiosInstance } from '../config/axios';
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom';
export const AuthStore = create((set) => ({
   authUser: null,
    isSignup: false,
    isLogging: false,
    isLoggingOut: false,
    isCheckingAuth: true,

    signup: async(formData,navigate)=>{
        set({isSignup: true});
        try {
            const response = await axiosInstance.post('/user/signup',formData);
            set({authUser: response.data});
            toast.success("Account Created successfully");
             navigate('/');
        } catch (error) {
            console.error("Signup Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.msg);
        } finally {
            set({isSignup: false});
        }
    },
    login: async(formData,navigate)=>{
        set({isLogging: true});
        try {
            const response = await axiosInstance.post('/user/login',formData);
            set({authUser: response.data});
            toast.success("Login successfully");
            navigate('/');
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.msg);
        } finally {
            set({isLogging: false});
        }
    },
    logout: async(navigate)=>{
        set({isLoggingOut: true});
        try {
            await axiosInstance.post('/user/logout');
            set({authUser: null});
            toast.success("Logout successfully");
            navigate('/login');
        } catch (error) {
            console.error("Logout Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.msg);
        } finally {
            set({isLoggingOut: false});
        }
    },
    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axiosInstance.get('/user/check');
            set({ authUser: response.data.user });
        } catch (error) {
            console.error("Check Auth Error:", error.response?.data || error.message);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    }
}));