import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../config/api';

const MockInterview = () => {
    const [role, setRole] = useState('Frontend Engineer');
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [userName, setUserName] = useState('');
    
    // Voice / Audio States
    const [isListening, setIsListening] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    
    const chatEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const roles = [
        "Frontend Engineer",
        "Backend Engineer",
        "Full Stack Engineer",
        "Data Engineer",
        "DevOps / SRE",
        "Product Manager"
    ];

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Initialize Web Speech API (Speech to Text)
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn("Speech recognition not supported in this browser.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event) => {
            let currentTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                currentTranscript += event.results[i][0].transcript;
            }
            // Update the input field with the transcribed text
            setInput(prev => prev + ' ' + currentTranscript.trim());
        };

        recognitionRef.current.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
            setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
            setIsListening(false);
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            // Stop any ongoing speech synthesis if component unmounts
            window.speechSynthesis.cancel();
        };
    }, []);

    // Load user name from localStorage
    useEffect(() => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userObj = JSON.parse(userStr);
                if (userObj && userObj.name) {
                    setUserName(userObj.name);
                }
            }
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
        }
    }, []);

    // Text to Speech
    const speakText = (text) => {
        if (!voiceEnabled || !('speechSynthesis' in window)) return;
        
        // Stop any current reading
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Try to find a good authoritative English voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Microsoft David') || v.name.includes('Microsoft Mark') || v.lang === 'en-US');
        if (preferredVoice) utterance.voice = preferredVoice;
        
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setInput(''); // Clear input before new dictation
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const startInterview = async () => {
        setHasStarted(true);
        setLoading(true);
        
        // Initial silent system prompt to set the context
        const nameContext = userName ? `My name is ${userName}.` : "I am a candidate.";
        const initialPrompt = `You are an expert technical interviewer at a top-tier tech company (like Google or Amazon). ${nameContext} I am interviewing for the ${role} position. Start the interview by briefly introducing yourself, greeting me by my name, and asking me the first technical or behavioral question. Keep your responses strictly as the interviewer. Do NOT provide the answers for me.`;
        
        try {
            const response = await axios.post(`${API_URL}/api/ai/mentor`, {
                history: [],
                question: initialPrompt,
            });

            setMessages([{ role: 'model', text: response.data.answer }]);
            speakText(response.data.answer);
        } catch (err) {
            console.error("Interview Start Error:", err);
            setMessages([{
                role: 'model',
                text: 'System Error: Cannot connect to the Interviewer AI right now.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const sendAnswer = async () => {
        if (!input.trim() || loading) return;

        const candidateAnswer = input;
        setMessages(prev => [...prev, { role: 'user', text: candidateAnswer }]);
        setInput('');
        setLoading(true);

        try {
            // Reconstruct the history correctly for the Gemini endpoint handling
            const history = messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            // We append a reminder to stay in character to prevent Gemini from slipping back into "mentor" mode
            const strictPrompt = `${candidateAnswer}\n\n[System Rule: 1. Briefly evaluate the candidate's answer above (tell them if it is correct or incorrect). 2. Ask a follow-up question OR move to a new topic based on the ${role} requirements. Do not break character.]`;

            const response = await axios.post(`${API_URL}/api/ai/mentor`, {
                history: [...history, { role: 'user', parts: [{ text: candidateAnswer }] }],
                question: strictPrompt
            });

            setMessages(prev => [...prev, { role: 'model', text: response.data.answer }]);
            speakText(response.data.answer);
        } catch (err) {
            console.error("Interview Request Error:", err);
            const errorMsg = 'Connection interrupted. Please try re-sending your answer.';
            setMessages(prev => [...prev, {
                role: 'model',
                text: errorMsg
            }]);
            speakText(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const endInterview = () => {
        setHasStarted(false);
        setMessages([]);
        if (isListening) {
             recognitionRef.current?.stop();
             setIsListening(false);
        }
        window.speechSynthesis.cancel();
    };

    if (!hasStarted) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 text-center">
                        <div className="mb-4">
                            <div className="d-inline-flex justify-content-center align-items-center rounded-circle mb-4" style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', color: 'white' }}>
                                <i className="bi bi-mic-fill fs-1"></i>
                            </div>
                            <h2 className="fw-bolder" style={{ fontFamily: "'Outfit', sans-serif", color: '#0f172a' }}>AI Technical Interview</h2>
                            <p className="text-muted fs-5">Practice your skills in a real-time simulation with our Gemini-powered technical recruiter.</p>
                        </div>

                        <div className="card shadow-sm border-0 rounded-4 p-4 text-start bg-white">
                            <label className="form-label fw-bold text-muted small text-uppercase tracking-wider mb-3">Select Target Role</label>
                            
                            <div className="d-flex flex-column gap-2 mb-4">
                                {roles.map(r => (
                                    <div 
                                        key={r}
                                        onClick={() => setRole(r)}
                                        className={`p-3 rounded-3 d-flex align-items-center gap-3 border ${role === r ? 'border-primary bg-primary bg-opacity-10' : 'border-light bg-light'} cursor-pointer`}
                                        style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                                    >
                                        <div className={`rounded-circle d-flex justify-content-center align-items-center ${role === r ? 'bg-primary text-white' : 'bg-white text-muted border'}`} style={{ width: '24px', height: '24px' }}>
                                            {role === r && <i className="bi bi-check" style={{ fontSize: '1.2rem', marginTop: '2px' }}></i>}
                                        </div>
                                        <span className={`fw-semibold ${role === r ? 'text-primary' : 'text-dark'}`}>{r}</span>
                                    </div>
                                ))}
                            </div>

                            <button onClick={startInterview} disabled={loading} className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '1.1rem' }}>
                                {loading ? <span className="spinner-border spinner-border-sm"></span> : <><i className="bi bi-play-fill fs-5"></i> Begin Simulation</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
        <style>{`
            .interview-container {
                height: calc(100vh - 120px);
            }
            @media (max-width: 1024px) {
                .interview-container {
                    height: calc(100vh - 220px);
                }
            }
        `}</style>
        <div className="d-flex flex-column interview-container">
            <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-white rounded-4 shadow-sm border border-light">
                <div className="d-flex align-items-center gap-3">
                    <div className="position-relative">
                        <div className="rounded-circle bg-dark d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ width: '48px', height: '48px', fontSize: '1.2rem', fontFamily: "'Outfit', sans-serif" }}>
                            AI
                        </div>
                        <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: '12px', height: '12px' }}></span>
                    </div>
                    <div>
                        <h6 className="mb-0 fw-bold" style={{ color: '#0f172a' }}>Senior Recruiter</h6>
                        <span className="text-muted small">Interviewing for: <span className="fw-semibold text-primary">{role}</span></span>
                    </div>
                </div>
                
                <div className="d-flex align-items-center gap-2">
                    <button 
                        onClick={() => {
                            setVoiceEnabled(!voiceEnabled);
                            if (voiceEnabled) window.speechSynthesis.cancel();
                        }} 
                        className={`btn btn-sm ${voiceEnabled ? 'btn-primary bg-opacity-10 text-primary border-primary' : 'btn-outline-secondary'} rounded-pill fw-medium d-flex align-items-center gap-2 px-3`}
                    >
                        <i className={`bi ${voiceEnabled ? 'bi-volume-up-fill' : 'bi-volume-mute-fill'}`}></i>
                        {voiceEnabled ? 'AI Voice On' : 'AI Voice Off'}
                    </button>
                    <button onClick={endInterview} className="btn btn-outline-danger btn-sm rounded-pill fw-medium px-3">
                        End Interview
                    </button>
                </div>
            </div>

            <div className="flex-grow-1 card border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column bg-white">
                <div className="flex-grow-1 p-4 overflow-auto" style={{ backgroundColor: '#f8fafc' }}>
                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`d-flex mb-4 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                            >
                                <div style={{ maxWidth: '80%' }}>
                                    <div className="d-flex align-items-center gap-2 mb-1 px-1">
                                        <span className="small fw-semibold text-muted text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                                            {msg.role === 'user' ? 'You' : 'Interviewer'}
                                        </span>
                                    </div>
                                    <div className={`p-3 shadow-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white text-dark border'}`} style={{ borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                        {msg.text.split('\n').map((line, i) => (
                                            <React.Fragment key={i}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="d-flex justify-content-start mb-4">
                            <div>
                                <div className="small fw-semibold text-muted text-uppercase mb-1 px-1" style={{ fontSize: '0.7rem' }}>Interviewer</div>
                                <div className="bg-white border p-3 shadow-sm d-flex gap-2 align-items-center" style={{ borderRadius: '16px 16px 16px 0' }}>
                                    <div className="spinner-grow spinner-grow-sm text-primary" role="status" style={{ animationDelay: '0s' }}></div>
                                    <div className="spinner-grow spinner-grow-sm text-primary" role="status" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="spinner-grow spinner-grow-sm text-primary" role="status" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="p-3 bg-white border-top">
                    {isListening && (
                        <div className="text-center mb-2">
                            <span className="badge bg-danger rounded-pill px-3 py-2 animate-pulse d-inline-flex gap-2 align-items-center">
                                <span className="spinner-grow spinner-grow-sm text-white" role="status" aria-hidden="true" style={{ width: '12px', height: '12px' }}></span>
                                Listening to your voice... Speak clearly.
                            </span>
                        </div>
                    )}
                    <div className="input-group input-group-lg" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <button
                            onClick={toggleListening}
                            disabled={loading}
                            className={`btn ${isListening ? 'btn-danger' : 'btn-light'} border-light fs-5 px-3`}
                            style={{ transition: 'all 0.2s' }}
                            title="Hold to dictate your answer"
                        >
                            <i className={`bi ${isListening ? 'bi-mic-fill text-white' : 'bi-mic text-secondary'}`}></i>
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendAnswer()}
                            disabled={loading || isListening}
                            placeholder={isListening ? "Listening..." : "Type your answer or use the microphone..."}
                            className="form-control border-light shadow-none px-3"
                            style={{ backgroundColor: isListening ? '#fef2f2' : '#f8fafc', fontSize: '0.95rem' }}
                        />
                        <button
                            onClick={sendAnswer}
                            disabled={loading || !input.trim()}
                            className="btn btn-primary px-4 fw-bold"
                            style={{ backgroundColor: input.trim() ? '#2563eb' : '#94a3b8', transition: 'all 0.2s' }}
                        >
                            <i className="bi bi-send-fill fs-5"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default MockInterview;
