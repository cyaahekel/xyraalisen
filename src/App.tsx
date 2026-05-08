import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ToolsStore from './pages/ToolsStore';
import BuyLicense from './pages/BuyLicense';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

import { AuthProvider } from './context/AuthContext';
import Announcement from './components/Announcement';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tools" element={<ToolsStore />} />
            <Route path="/buy" element={<BuyLicense />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Announcement />
    </AuthProvider>
  );
}
