import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import CaptainLogin from './pages/CaptainLogin';
import CaptainRegister from './pages/CaptainRegister';
import Layout from './features/global/components/layout';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="user-login" element={<UserLogin />} />
          <Route path="user-register" element={<UserRegister />} />
          <Route path="captain-login" element={<CaptainLogin />} />
          <Route path="captain-register" element={<CaptainRegister />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
