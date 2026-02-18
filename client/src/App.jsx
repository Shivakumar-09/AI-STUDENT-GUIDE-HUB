import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import API_URL from './config/api';
import './App.css';
import AppShell from './components/AppShell';
import Dashboard from './components/Dashboard';
import Mentor from './components/Mentor';
import Roadmap from './components/Roadmap';
import Quiz from './components/Quiz';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import Opportunities from './components/Opportunities';
import Courses from './components/Courses';
import Auth from './components/Auth';

console.log("App component loaded");

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get(`${API_URL}/api/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
          if (location.pathname === '/login') navigate('/dashboard');
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading AI Hub...</span>
        </div>
        <h5 className="text-muted fw-light">Loading AI Student Hub...</h5>
      </div>
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/login" element={
        !user ? <Auth onLogin={(userData) => {
          setUser(userData);
          navigate('/dashboard');
        }} /> : <Navigate to="/dashboard" />
      } />

      <Route path="/*" element={
        <ProtectedRoute>
          <AppShell onLogout={handleLogout}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/mentor" element={<Mentor />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/resume" element={<ResumeAnalyzer />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </AppShell>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
