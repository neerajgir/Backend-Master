import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from "../src/pages/HomePage"
import SignUpPage from "../src/pages/SignUpPage"
import LoginPage from "../src/pages/LoginPage"
import SettingsPage from "../src/pages/SettingsPage"
import ProfilePage from "../src/pages/ProfilePage"
import { Toaster } from 'react-hot-toast';
import {useAuthStore} from './store/useAuthStore'
import { Loader } from 'lucide-react';
import Navbar from './components/NavBar';

const App = () => {
  const {authUser, checkAuth, isCheckingAuth, } = useAuthStore();
  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  if(isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
    )
  }
  return (
    <div className="text-5xl font-bold">
      <Navbar/>
      <Routes>
      <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App