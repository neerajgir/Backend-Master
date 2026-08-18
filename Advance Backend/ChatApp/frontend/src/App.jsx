import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from "../src/pages/HomePage"
import SignUpPage from "../src/pages/SignUpPage"
import LoginPage from "../src/pages/LoginPage"
import SettingsPage from "../src/pages/SettingsPage"
import ProfilePage from "../src/pages/ProfilePage"

const App = () => {
  const authUser = false;
  return (
    <div className="text-5xl font-bold">
      <Routes>
      <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App