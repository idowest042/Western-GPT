import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import Home from './Components/Home'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthStore } from './AuthStore/AuthStore'
import { useEffect } from 'react'
import { Navigate } from "react-router-dom";
import { Loader } from 'lucide-react'


const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = AuthStore();
  useEffect(()=>{
      checkAuth()
    },[checkAuth]);
      if (isCheckingAuth && !authUser)
        return (
          <div className="flex items-center justify-center h-screen">
            <Loader className="size-10 animate-spin" />
          </div>
        );
  return (
    <>
    <ToastContainer />
    <div className='text-blue-500 '>
      <Routes>
        <Route path='/register' element={!authUser ? <Signup/> : <Navigate to='/' />}/>
        <Route path='/login' element={!authUser ? <Login/> : <Navigate to='/' />}/>
        <Route path='/' element={authUser ? <Home/> : <Navigate to='/login' />}/>
      </Routes>
    </div>
    </>
    
  )
}

export default App