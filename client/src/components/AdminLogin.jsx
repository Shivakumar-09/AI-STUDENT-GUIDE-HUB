import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

function AdminLogin() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post(`${API_URL}/api/admin/login`, credentials);
            localStorage.setItem('adminToken', res.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8f9fa',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div className="card shadow-lg border-0" style={{
                width: '100%',
                maxWidth: '450px',
                padding: '48px 40px',
                borderRadius: '24px',
                background: '#ffffff',
            }}>
                <div className="text-center mb-4">
                    {/* Google-esque 4-color Logo abstract */}
                    <div className="d-flex justify-content-center gap-1 mb-4">
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#4285F4' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EA4335' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FBBC05' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#34A853' }}></div>
                    </div>
                    <h3 className="fw-semibold text-dark mb-1" style={{ letterSpacing: '-0.5px' }}>Administrator Sign in</h3>
                    <p style={{ color: '#5f6368', fontSize: '1rem' }}>Use your authorized Google Student Admin Account</p>
                </div>

                {error && (
                    <div className="alert d-flex align-items-center mb-4" style={{ backgroundColor: '#fce8e6', color: '#c5221f', border: 'none', borderRadius: '8px', fontSize: '0.9rem' }}>
                        <i className="bi bi-exclamation-circle-fill me-2 fs-5"></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div className="form-floating">
                            <input 
                                type="email" 
                                name="email" 
                                className="form-control" 
                                id="adminEmailInput"
                                placeholder="Email or phone"
                                value={credentials.email}
                                onChange={handleChange}
                                style={{ 
                                    borderRadius: '4px', border: '1px solid #dadce0', padding: '16px 14px', height: 'auto', fontSize: '1rem' 
                                }}
                                required 
                            />
                            <label htmlFor="adminEmailInput" style={{ color: '#5f6368' }}>Email or phone</label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="form-floating">
                            <input 
                                type="password" 
                                name="password" 
                                className="form-control" 
                                id="adminPasswordInput"
                                placeholder="Enter your password"
                                value={credentials.password}
                                onChange={handleChange}
                                style={{ 
                                    borderRadius: '4px', border: '1px solid #dadce0', padding: '16px 14px', height: 'auto', fontSize: '1rem' 
                                }}
                                required 
                            />
                            <label htmlFor="adminPasswordInput" style={{ color: '#5f6368' }}>Enter your password</label>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-5">
                        <button 
                            type="button" 
                            className="btn btn-link text-decoration-none fw-semibold" 
                            onClick={() => navigate('/login')}
                            style={{ color: '#1a73e8', padding: '0' }}
                        >
                            Return to student login
                        </button>

                        <button 
                            type="submit" 
                            className="btn fw-semibold px-4 py-2" 
                            disabled={loading}
                            style={{
                                borderRadius: '4px',
                                backgroundColor: '#1a73e8',
                                color: '#ffffff',
                                border: 'none',
                                fontSize: '0.95rem'
                            }}
                        >
                            {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Next'}
                        </button>
                    </div>
                </form>
            </div>
            {/* Footer links typical of Google login */}
            <div style={{ position: 'absolute', bottom: '24px', width: '100%', maxWidth: '450px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#5f6368' }}>
                <span>English (United States)</span>
                <div className="d-flex gap-4">
                    <span style={{ cursor: 'pointer' }}>Help</span>
                    <span style={{ cursor: 'pointer' }}>Privacy</span>
                    <span style={{ cursor: 'pointer' }}>Terms</span>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
