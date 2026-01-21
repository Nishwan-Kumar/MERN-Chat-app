import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import {Loader} from "lucide-react"
import {Toaster} from "react-hot-toast"
import { useThemeStore } from './store/useThemeStore'

const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore()
  const {theme} = useThemeStore();

  console.log(onlineUsers)
  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  if (isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"></Loader>
    </div>
  )

  console.log({authUser})
  return (
    <div data-theme={theme} className='min-h-screen bg-base-200 transition-colors duration-300'>
      <Navbar />
          <Routes>
          <Route path='/' element={authUser?<HomePage />:<Navigate to="/login" />}/>
          <Route path='/signup' element={authUser?<Navigate to="/"/>:<SignUpPage /> }/>
          <Route path='/login' element={authUser?<Navigate to="/"/>:<LoginPage />}/>
          <Route path='/settings' element={<SettingsPage />}/>
          <Route path='/profile' element={authUser?<ProfilePage />:<Navigate to="/" />}/>
          {/* <Route path='/' element={<HomePage />}/>
          <Route path='/signup' element={<SignUpPage /> }/>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/settings' element={<SettingsPage />}/>
          <Route path='/profile' element={<ProfilePage />}/> */}
          </Routes>
      <Toaster />
    </div>
  )
}

export default App