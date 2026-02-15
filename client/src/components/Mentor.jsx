import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../config/api';

const Mentor = () => {
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Identity Verified. Career Advisor Online. \n\nI have indexed your trajectory. How shall we optimize your engineering path today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState({
        short: true,
        eli5: false
    });
    const chatEndRef = useRef(null);

    const strategies = [
        { label: "System Design Check", prompt: "Can you review system design patterns for a scalable chat app?" },
        { label: "Mock Interview", prompt: "Let's do a quick mock interview for a Frontend role." },
        { label: "Debug My Logic", prompt: "I have a weird bug with React state not updating. Can you help?" },
        { label: "MAANG Resume Tip", prompt: "What are the key keywords for an Amazon SDE resume?" }
    ];

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const askMentor = async (textOverride) => {
        const messageText = textOverride || input;
        if (!messageText.trim() || loading) return;

        const userMessage = { role: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const history = messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            const response = await axios.post(`${API_URL}/api/ai/mentor`, {
                history: [...history, { role: 'user', parts: [{ text: messageText }] }],
                question: messageText,
                ...options // Keep options if they are still relevant for the new API endpoint
            });

            setMessages(prev => [...prev, { role: 'model', text: response.data.answer }]);
        } catch (err) {
            console.error("Mentor Request Error:", err.response?.data || err.message);
            setMessages(prev => [...prev, {
                role: 'model',
                text: 'Sorry, I couldn\'t reach the mentor. Make sure the server is running and check your API key.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mentor-redesign-container" style={{ height: 'calc(100vh - 220px)', display: 'flex', gap: '32px' }}>

            {/* LEFT: STRATEGY & CONFIG */}
            <div className="mentor-sidebar" style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card"
                    style={{ padding: '24px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--progress)', boxShadow: '0 0 12px var(--progress)' }}></div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-main)' }}>Advisor Status: Online</span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '8px' }}>Deep Advisor</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                        Leveraging Gemini 1.5 Flash to provide context-aware engineering guidance.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Response Mode</div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setOptions({ ...options, short: !options.short })}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                                    background: options.short ? 'var(--accent-glow)' : '#f8fafc',
                                    color: options.short ? 'var(--learning)' : 'var(--text-muted)',
                                    fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer'
                                }}
                            >
                                Concise
                            </button>
                            <button
                                onClick={() => setOptions({ ...options, eli5: !options.eli5 })}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                                    background: options.eli5 ? 'var(--accent-glow)' : '#f8fafc',
                                    color: options.eli5 ? 'var(--learning)' : 'var(--text-muted)',
                                    fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer'
                                }}
                            >
                                ELI5
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card"
                    style={{ padding: '24px', flex: 1 }}
                >
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Strategy Chips</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {strategies.map((s, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => askMentor(s.prompt)}
                                style={{
                                    textAlign: 'left', padding: '14px', borderRadius: '12px', background: '#f1f5f9', border: '1px solid var(--border-subtle)',
                                    fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer', transition: '0.2s'
                                }}
                            >
                                {s.label}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* RIGHT: CHAT INTERFACE */}
            <div className="chat-container-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                    <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <AnimatePresence initial={false}>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    style={{
                                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '75%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                                    }}
                                >
                                    <div style={{
                                        padding: '16px 20px',
                                        borderRadius: msg.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                                        background: msg.role === 'user' ? 'var(--accent)' : '#f1f5f9',
                                        color: msg.role === 'user' ? '#fff' : 'var(--text-main)',
                                        fontSize: '0.95rem',
                                        lineHeight: 1.6,
                                        boxShadow: msg.role === 'user' ? '0 10px 25px var(--accent-glow)' : 'none',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {msg.text}
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '6px', fontWeight: 700, textTransform: 'uppercase' }}>
                                        {msg.role === 'user' ? 'Candidate' : 'Advisor'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: 'flex-start' }}>
                                <div style={{ background: '#f1f5f9', padding: '12px 20px', borderRadius: '20px 20px 20px 0', display: 'flex', gap: '6px' }}>
                                    {[0, 1, 2].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                                            style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-dim)' }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="chat-input-area" style={{ padding: '24px', background: '#f8fafc', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '16px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && askMentor()}
                            placeholder="Type your query for deeper analysis..."
                            style={{
                                flex: 1, padding: '16px 24px', borderRadius: '16px', border: '1px solid var(--border-subtle)',
                                background: '#fff', fontSize: '1rem', outline: 'none', transition: '0.3s'
                            }}
                        />
                        <button
                            className="btn"
                            onClick={() => askMentor()}
                            disabled={loading}
                            style={{
                                padding: '0 32px', borderRadius: '16px', background: 'var(--accent)', color: '#fff',
                                fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            <span>Transmit</span>
                            <span style={{ fontSize: '1.2rem' }}>⚡</span>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .chat-messages::-webkit-scrollbar { width: 6px; }
                .chat-messages::-webkit-scrollbar-track { background: transparent; }
                .chat-messages::-webkit-scrollbar-thumb { background: #e2e8f0; borderRadius: 10px; }
                input:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 4px var(--accent-glow); }
                @media (max-width: 1000px) {
                    .mentor-redesign-container { 
                        flex-direction: column !important; 
                        height: auto !important;
                        gap: 20px !important;
                    }
                    .mentor-sidebar { 
                        width: 100% !important; 
                        order: 2;
                    }
                    .chat-container-main {
                        height: 500px !important;
                        order: 1;
                    }
                    .chat-messages {
                        padding: 16px !important;
                    }
                    .chat-input-area {
                        padding: 12px !important;
                        gap: 8px !important;
                    }
                    .chat-input-area button {
                        padding: 0 16px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Mentor;
