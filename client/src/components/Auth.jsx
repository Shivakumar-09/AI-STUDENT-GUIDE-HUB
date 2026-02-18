import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../config/api';

const Auth = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', skills: '', targetJobs: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        try {
            const response = await axios.post(`${API_URL}${endpoint}`, formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            onLogin(response.data.user);
        } catch (err) {
            if (!err.response) {
                setError('Cockpit Link Failed. Verify backend status.');
            } else {
                setError(err.response?.data?.message || 'Verification failed. Retry access.');
            }
        } finally {
            setLoading(false);
        }
    };

    // UI Variants for Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <div className="auth-master-container" style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-deep)', overflow: 'hidden', position: 'relative' }}>

            {/* LEFT PANEL: IMMERSIVE VISUALS (Visible on Desktop) */}
            <div className="auth-visual-panel" style={{
                flex: '1.4',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '80px',
                background: '#f8fafc',
            }}>
                {/* Background effects */}
                <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'var(--learning)', filter: 'blur(150px)', opacity: 0.1, borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: '0%', right: '0%', width: '400px', height: '400px', background: 'var(--intelligence)', filter: 'blur(150px)', opacity: 0.08, borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }}></div>

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: 'relative', zIndex: 2 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
                        <div style={{ width: '48px', height: '48px', background: 'var(--accent)', borderRadius: '14px', display: 'grid', placeItems: 'center', boxShadow: '0 8px 24px var(--accent-glow)' }}>
                            <span style={{ fontSize: '1.5rem' }}>🤖</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--accent)', textTransform: 'uppercase' }}>Adaptive Engine</span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-dim)' }}>SYSTEM READY • PROT-092</span>
                        </div>
                    </div>

                    <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1.05, marginBottom: '32px', maxWidth: '700px', letterSpacing: '-0.03em' }}>
                        Engineering the <span style={{ background: 'linear-gradient(to right, var(--text-main), var(--learning))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Future</span>, One Insight at a Time.
                    </h1>

                    <p style={{ fontSize: '1.35rem', color: 'var(--text-muted)', maxWidth: '550px', lineHeight: 1.6, marginBottom: '56px', fontWeight: 400 }}>
                        The premier career cockpit for the next generation of product engineers. Join 12,000+ students mastering MAANG-grade engineering.
                    </p>

                    <div style={{ display: 'flex', gap: '24px' }}>
                        <motion.div
                            whileHover={{ y: -8, scale: 1.02 }}
                            style={{ padding: '24px', borderRadius: '20px', background: '#f8fafc', border: '1px solid var(--border-subtle)', backdropFilter: 'blur(20px)', width: '220px' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--progress)', boxShadow: '0 0 10px var(--progress)' }}></div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Success Rate</span>
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>94%</div>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -8, scale: 1.02 }}
                            style={{ padding: '24px', borderRadius: '20px', background: '#f8fafc', border: '1px solid var(--border-subtle)', backdropFilter: 'blur(20px)', width: '220px' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--intelligence)', boxShadow: '0 0 10px var(--intelligence)' }}></div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mentors</span>
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>12.4k</div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* RIGHT PANEL: AUTH FORM */}
            <div className="auth-form-panel" style={{
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                zIndex: 10,
                background: '#ffffff',
                borderLeft: '1px solid var(--border-subtle)'
            }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ width: '100%', maxWidth: '400px' }}
                >
                    <motion.div variants={itemVariants} style={{ marginBottom: '44px' }}>
                        <div style={{ width: '32px', height: '32px', background: 'var(--accent-glow)', borderRadius: '8px', display: 'grid', placeItems: 'center', marginBottom: '20px' }}>
                            <span style={{ fontSize: '1rem' }}>🛡️</span>
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '12px', letterSpacing: '-0.02em' }}>
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                            {isLogin ? 'Welcome back to your career cockpit.' : 'Begin your journey to MAANG-standard engineering.'}
                        </p>
                    </motion.div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    key="signup-field"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="input-group">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Identity Name</label>
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, fontSize: '1.1rem' }}>👤</span>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="First Last"
                                                style={{ width: '100%', padding: '16px 16px 16px 52px', borderRadius: '16px', background: '#f1f5f9', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', transition: '0.3s' }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="input-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Secure</label>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, fontSize: '1.1rem' }}>📧</span>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@domain.ai"
                                    style={{ width: '100%', padding: '16px 16px 16px 52px', borderRadius: '16px', background: '#f1f5f9', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', transition: '0.3s' }}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Access Key</label>
                                {isLogin && <span style={{ fontSize: '0.75rem', color: 'var(--accent)', cursor: 'pointer', fontWeight: 800 }}>Forgot?</span>}
                            </div>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, fontSize: '1.1rem' }}>🔒</span>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    style={{ width: '100%', padding: '16px 16px 16px 52px', borderRadius: '16px', background: '#f1f5f9', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', transition: '0.3s' }}
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    color: 'var(--danger)',
                                    background: 'rgba(244, 63, 94, 0.08)',
                                    padding: '14px 18px',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(244, 63, 94, 0.2)',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontWeight: 500
                                }}
                            >
                                <span>⚠️</span> {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: 'var(--learning)' }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '18px',
                                borderRadius: '18px',
                                background: 'var(--accent)',
                                color: '#fff',
                                border: 'none',
                                fontWeight: 900,
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                transition: '0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                                boxShadow: '0 12px 40px var(--accent-glow)',
                                marginTop: '12px'
                            }}
                        >
                            {loading ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <div className="spinner" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                    <span>Authorizing...</span>
                                </div>
                            ) : (isLogin ? 'Enter System' : 'Initialize Profile')}
                        </motion.button>
                    </form>

                    <motion.p variants={itemVariants} style={{ marginTop: '40px', textAlign: 'center', fontSize: '1rem', color: 'var(--text-muted)' }}>
                        {isLogin ? "Not registered yet?" : "Existing user?"} {' '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: '4px' }}
                        >
                            {isLogin ? 'Create Account' : 'Sign In Now'}
                        </button>
                    </motion.p>
                </motion.div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 1100px) {
                    .auth-visual-panel { display: none !important; }
                    .auth-form-panel { flex: 1 !important; border-left: none !important; padding: 40px 24px !important; }
                    h2 { font-size: 2.25rem !important; }
                }
                input:focus {
                    border-color: var(--accent) !important;
                    background: #ffffff !important;
                    box-shadow: 0 0 0 4px var(--accent-glow);
                }
            `}</style>
        </div>
    );
};

export default Auth;
