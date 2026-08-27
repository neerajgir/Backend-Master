import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Riding from './pages/Riding';
import Captain from './pages/Captain';
import Layout from './features/global/components/layout';
import ProtectedRoute from './features/global/components/protected-route';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="user-login" element={<Navigate to="/login" replace />} />
          <Route path="captain-login" element={<Navigate to="/login" replace />} />
          <Route path="user-register" element={<Navigate to="/register" replace />} />
          <Route path="captain-register" element={<Navigate to="/register" replace />} />
        </Route>
        <Route
          path="/riding"
          element={
            <ProtectedRoute role="user">
              <Riding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/captain"
          element={
            <ProtectedRoute role="captain">
              <Captain />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
