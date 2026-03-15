import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

function AdminDashboard() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const adminToken = localStorage.getItem('adminToken');
                if (!adminToken) {
                    navigate('/admin/login');
                    return;
                }

                const res = await axios.get(`${API_URL}/api/admin/students`, {
                    headers: { Authorization: `Bearer ${adminToken}` }
                });

                setStudents(res.data);
                setError('');
            } catch (err) {
                console.error("Failed to fetch secure student data", err);
                setError('Authentication failed or session expired. Please login again.');
                if (err.response?.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.track && s.track.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Google Material Colors for dynamic avatars
    const gColors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8E24AA', '#00ACC1'];
    const getMaterialColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
        return gColors[Math.abs(hash) % gColors.length];
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#ffffff' }}>
                <div className="spinner-border" style={{ color: '#4285F4', width: '3rem', height: '3rem' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Inter', sans-serif" }}>

            {/* Google Workspace Style Navbar */}
            <nav className="navbar navbar-expand-lg px-4 py-2" style={{
                background: '#ffffff',
                borderBottom: '1px solid #dadce0',
                position: 'sticky', top: 0, zIndex: 50
            }}>
                <div className="container-fluid align-items-center p-0">
                    <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-light rounded-circle p-2" style={{ border: 'none' }}>
                            <i className="bi bi-list fs-4 text-secondary"></i>
                        </button>
                        <div className="d-flex align-items-center ms-2" style={{ userSelect: 'none' }}>
                            <span className="fs-4 me-1" style={{ color: '#5f6368' }}>
                                <i className="bi bi-mortarboard-fill"></i>
                            </span>
                            <span className="badge rounded-pill ms-3 bg-primary bg-opacity-10 text-primary fw-normal border border-primary-subtle" style={{ letterSpacing: '0.5px' }}>Admin Console</span>
                        </div>
                    </div>

                    {/* Minimalist Search embedded in Nav */}
                    <div className="d-none d-md-flex mx-auto" style={{ maxWidth: '600px', width: '100%' }}>
                        <div className="input-group" style={{
                            background: '#f1f3f4', borderRadius: '8px',
                            border: '1px solid transparent', overflow: 'hidden'
                        }}>
                            <span className="input-group-text bg-transparent border-0 text-secondary ps-3">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control bg-transparent border-0 shadow-none py-2"
                                placeholder="Search by name, email, or track"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ color: '#202124' }}
                            />
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-light rounded-circle p-2" style={{ border: 'none' }}>
                            <i className="bi bi-question-circle text-secondary fs-5"></i>
                        </button>
                        <button className="btn btn-light rounded-circle p-2 me-3" style={{ border: 'none' }}>
                            <i className="bi bi-grid-3x3-gap text-secondary fs-5"></i>
                        </button>
                        <div className="dropdown">
                            <button className="btn p-0 border-0 rounded-circle" data-bs-toggle="dropdown" aria-expanded="false" onClick={handleLogout} title="Sign out of Administrator">
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    background: '#1a73e8', color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 600, fontSize: '1rem', border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                }}>
                                    A
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container-fluid py-4 px-4 px-md-5">
                {error && (
                    <div className="alert border-0 d-flex align-items-center mb-4 shadow-sm" style={{ background: '#fce8e6', color: '#c5221f', borderRadius: '8px' }}>
                        <i className="bi bi-exclamation-circle-fill fs-5 me-3"></i>
                        {error}
                    </div>
                )}

                {/* Dashboard Header & Metrics */}
                <div className="row align-items-center mb-4">
                    <div className="col-md-7">
                        <h1 className="fw-normal mb-1" style={{ fontSize: '1.75rem', color: '#202124', letterSpacing: '-0.01em' }}>Student Directory</h1>
                        <p className="mb-0 text-secondary">Manage highly secure student profiles connected to this workspace.</p>
                    </div>

                    <div className="col-md-5 mt-4 mt-md-0 d-flex justify-content-md-end">
                        <div className="card shadow-sm border-0 d-inline-flex flex-row align-items-center p-3" style={{ borderRadius: '8px', minWidth: '240px' }}>
                            <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px', backgroundColor: '#e8f0fe', color: '#1a73e8' }}>
                                <i className="bi bi-people-fill fs-4"></i>
                            </div>
                            <div>
                                <h6 className="mb-0 text-secondary" style={{ fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.3px', textTransform: 'uppercase' }}>Total Registered Students</h6>
                                <h2 className="mb-0 fw-normal" style={{ color: '#202124', fontSize: '2rem' }}>{students.length}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Material Design Data Table Widget */}
                <div className="card border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                    <div className="card-header bg-white border-bottom-0 py-3 px-4 d-flex justify-content-between align-items-center">
                        <h6 className="m-0 fw-medium" style={{ color: '#202124' }}>Active Users</h6>
                        <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-secondary border-0 text-primary fw-medium" style={{ background: '#f8f9fa' }}>
                                <i className="bi bi-download me-2"></i>Download Decrypted CSV
                            </button>
                            <button className="btn btn-sm btn-outline-secondary border-0"><i className="bi bi-three-dots-vertical"></i></button>
                        </div>
                    </div>

                    <div className="table-responsive bg-white">
                        <table className="table table-hover align-middle mb-0" style={{ color: '#202124' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #dadce0', borderTop: '1px solid #dadce0' }}>
                                    <th className="py-3 ps-4 fw-medium text-secondary" style={{ fontSize: '0.875rem', paddingLeft: '24px' }}>Name</th>
                                    <th className="py-3 fw-medium text-secondary" style={{ fontSize: '0.875rem' }}>Secure Endpoint</th>
                                    <th className="py-3 fw-medium text-secondary" style={{ fontSize: '0.875rem' }}>Academic Pathway</th>
                                    <th className="py-3 fw-medium text-secondary" style={{ fontSize: '0.875rem' }}>Last Sign-in</th>
                                    <th className="py-3 pe-4 fw-medium text-secondary text-end" style={{ fontSize: '0.875rem', paddingRight: '24px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="d-flex flex-column align-items-center text-secondary py-4">
                                                <i className="bi bi-search fs-1 mb-3 bg-light rounded-circle p-4"></i>
                                                <h6 className="fw-normal text-dark">No students found matching "{searchTerm}"</h6>
                                                <p className="small">Try adjusting your workspace search filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => {
                                        const bgColor = getMaterialColor(student.email);
                                        return (
                                            <tr key={student.id} style={{ cursor: 'pointer', borderBottom: '1px solid #f1f3f4' }}>
                                                <td className="ps-4 py-3" style={{ paddingLeft: '24px' }}>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div style={{
                                                            width: '36px', height: '36px',
                                                            borderRadius: '50%',
                                                            background: bgColor,
                                                            color: '#fff',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '1rem', fontWeight: 500
                                                        }}>
                                                            {student.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 500, color: '#202124' }}>{student.name}</div>
                                                            <div style={{ fontSize: '0.8rem', color: '#5f6368' }}>{student.email}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3">
                                                    {student.phone ? (
                                                        <div className="d-flex align-items-center gap-2">
                                                            <i className="bi bi-shield-check" style={{ color: '#34A853', fontSize: '1rem' }}></i>
                                                            <span style={{ color: '#3c4043', fontSize: '0.9rem' }}>{student.phone}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-secondary" style={{ fontSize: '0.9rem' }}>Unassigned</span>
                                                    )}
                                                </td>

                                                <td className="py-3">
                                                    <div className="d-flex gap-2 align-items-center">
                                                        <span style={{ color: '#3c4043', fontSize: '0.9rem' }}>{student.track || 'Undeclared'}</span>
                                                        <span className="badge rounded-pill bg-light text-secondary border fw-normal" style={{ fontSize: '0.75rem' }}>Year {student.year || '?'}</span>
                                                    </div>
                                                </td>

                                                <td className="py-3">
                                                    <div style={{ color: '#3c4043', fontSize: '0.9rem' }}>
                                                        {new Date(student.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                </td>

                                                <td className="pe-4 py-3 text-end" style={{ paddingRight: '24px' }}>
                                                    <span className="fw-medium text-success d-flex align-items-center justify-content-end gap-1" style={{ fontSize: '0.85rem' }}>
                                                        <i className="bi bi-check-circle-fill"></i> Active
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
