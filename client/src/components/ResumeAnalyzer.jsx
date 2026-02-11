import React, { useState } from "react";
import axios from "axios";
import API_URL from '../config/api';
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, Sparkles, CheckCircle, AlertTriangle, Copy } from "lucide-react";

const ResumeAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const analyzeResume = async () => {
        if (!file && !text.trim()) {
            alert("Please upload a resume PDF or paste resume text");
            return;
        }

        setLoading(true);
        setAnalysis(null); // Clear previous analysis
        const formData = new FormData();
        file
            ? formData.append("file", file)
            : formData.append("fallback_text", text);

        try {
            const res = await axios.post(
                `${API_URL}/api/resume-analyze`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setAnalysis(res.data);
        } catch (err) {
            console.error("Resume Analysis Error:", err);
            if (err.response?.status === 429) {
                alert("🚀 AI service is busy due to high demand. Please wait 60 seconds and try again.");
            } else {
                const errorMsg = err.response?.data?.error || "Analysis failed. Please try again.";
                alert(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.backgroundBlur} />

            <div style={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={styles.header}
                >
                    <h1 style={styles.title}>
                        <span style={styles.titleGradient}>Resume Intelligence</span> Lab
                    </h1>
                    <p style={styles.subtitle}>
                        AI-powered analysis to align your profile with MAANG standards.
                    </p>
                </motion.div>

                <div style={styles.grid}>
                    {/* LEFT COLUMN: INPUT */}
                    <div style={styles.leftCol}>
                        <motion.div
                            style={styles.glassCard}
                            whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                        >
                            <label style={styles.uploadArea}>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    hidden
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                                <div style={styles.uploadIconWrap}>
                                    <UploadCloud size={32} color="#4f46e5" />
                                </div>
                                <h3 style={styles.uploadTitle}>
                                    {file ? file.name : "Upload Resume PDF"}
                                </h3>
                                <p style={styles.uploadSubtitle}>
                                    {file ? "Ready to analyze" : "Drag & drop or click to browse"}
                                </p>
                            </label>

                            <div style={styles.divider}>
                                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                                <span style={styles.dividerText}>OR PASTE TEXT</span>
                                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                            </div>

                            <textarea
                                rows={6}
                                placeholder="Paste your resume content here..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                style={styles.textarea}
                            />

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={analyzeResume}
                                disabled={loading}
                                style={{
                                    ...styles.button,
                                    opacity: loading ? 0.8 : 1,
                                    cursor: loading ? 'wait' : 'pointer'
                                }}
                            >
                                {loading ? (
                                    <span style={styles.btnContent}><Sparkles className="spin" size={18} /> Analyzing...</span>
                                ) : (
                                    <span style={styles.btnContent}><Sparkles size={18} /> Analyze with AI</span>
                                )}
                            </motion.button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            style={{ ...styles.glassCard, background: "linear-gradient(135deg, rgba(255,255,255,0.6), rgba(238,242,255,0.6))" }}
                        >
                            <div style={styles.tipHeader}>
                                <Sparkles size={16} color="#ca8a04" />
                                <span style={styles.tipTitle}>Pro Tip</span>
                            </div>
                            <p style={styles.tipText}>
                                Quantifying your achievements (e.g., "Reduced latency by 40%") can boost your ATS score by up to 25%.
                            </p>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: RESULTS */}
                    <div style={styles.rightCol}>
                        <AnimatePresence mode="wait">
                            {analysis ? (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5 }}
                                    style={styles.resultsContainer}
                                >
                                    {/* SCORE CARD */}
                                    <div style={styles.scoreCard}>
                                        <div style={styles.scoreRing}>
                                            <svg width="120" height="120" viewBox="0 0 120 120">
                                                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="8" />
                                                <motion.circle
                                                    cx="60" cy="60" r="54" fill="none" stroke="url(#gradient)" strokeWidth="8"
                                                    strokeLinecap="round"
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: (analysis.score || 85) / 100 }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                                                />
                                                <defs>
                                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="#4f46e5" />
                                                        <stop offset="100%" stopColor="#06b6d4" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div style={styles.scoreValue}>
                                                {analysis.score || 85}
                                                <span style={styles.scoreLabel}>/100</span>
                                            </div>
                                        </div>
                                        <div style={styles.scoreMeta}>
                                            <h3 style={styles.scoreTitle}>Resume Health</h3>
                                            <p style={styles.scoreDesc}>
                                                You are in the top <strong>{100 - (analysis.score || 85)}%</strong> of candidates.
                                            </p>
                                        </div>
                                    </div>

                                    {/* KEY METRICS */}
                                    <div style={styles.metricsGrid}>
                                        <div style={styles.metricCard}>
                                            <CheckCircle size={20} color="#16a34a" />
                                            <div>
                                                <div style={styles.metricLabel}>Impact</div>
                                                <div style={styles.metricValue}>High</div>
                                            </div>
                                        </div>
                                        <div style={styles.metricCard}>
                                            <AlertTriangle size={20} color="#ca8a04" />
                                            <div>
                                                <div style={styles.metricLabel}>Keywords</div>
                                                <div style={styles.metricValue}>Avg</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* IMPROVED SUMMARY */}
                                    <div style={styles.glassCard}>
                                        <div style={styles.cardHeader}>
                                            <h3 style={styles.cardTitle}>Optimized Summary</h3>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(analysis.improved_summary)}
                                                style={styles.iconBtn}
                                                title="Copy to clipboard"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                        <p style={styles.summaryText}>
                                            {analysis.improved_summary}
                                        </p>
                                    </div>

                                    {/* DETAILED FEEDBACK */}
                                    <div style={styles.glassCard}>
                                        <h3 style={styles.cardTitle}>Detailed Analysis</h3>
                                        <div
                                            style={styles.htmlContent}
                                            dangerouslySetInnerHTML={{ __html: analysis.analysis_html || analysis.feedback }}
                                        />
                                    </div>

                                    {/* JOBS */}
                                    {analysis.jobs_html && (
                                        <div style={styles.glassCard}>
                                            <h3 style={styles.cardTitle}>Recommended Roles</h3>
                                            <div
                                                style={styles.htmlContent}
                                                dangerouslySetInnerHTML={{ __html: analysis.jobs_html }}
                                            />
                                        </div>
                                    )}

                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={styles.placeholderCard}
                                >
                                    <div style={styles.placeholderIcon}>
                                        <FileText size={48} color="#94a3b8" />
                                    </div>
                                    <h3 style={styles.placeholderTitle}>Waiting for Data</h3>
                                    <p style={styles.placeholderText}>
                                        Upload your resume on the left to generate an infinite-depth analysis.
                                    </p>
                                    <div style={styles.placeholderDecor} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .spin { animation: spin 1s linear infinite; }
                
                .html-content {
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                }
                .html-content ul { 
                    padding-left: 0; 
                    margin: 20px 0; 
                    list-style: none;
                }
                .html-content li { 
                    margin-bottom: 16px; 
                    padding: 16px;
                    border-radius: 16px;
                    background: rgba(255, 255, 255, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    color: #334155; 
                    line-height: 1.6;
                    transition: transform 0.2s ease;
                }
                .html-content li:hover {
                    transform: translateX(4px);
                    background: rgba(255, 255, 255, 0.6);
                }
                .html-content strong { 
                    color: #0f172a; 
                    font-weight: 700;
                    display: block;
                    margin-bottom: 4px;
                    font-size: 1.05rem;
                }
                
                /* Highlighting Critical issues */
                .html-content li:has(strong:contains('Critical')),
                .html-content li:contains('Critical'),
                .html-content li:contains('Rectify') {
                    border-left: 4px solid #ef4444;
                    background: rgba(254, 242, 242, 0.5);
                }

                /* Job Cards Internal Styling */
                .job-grid { 
                    display: grid; 
                    gap: 16px; 
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); 
                    margin-top: 16px;
                }
                .job-card { 
                    background: rgba(255, 255, 255, 0.6); 
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.8); 
                    padding: 20px; 
                    border-radius: 20px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }
                .job-card:hover { 
                    transform: translateY(-4px); 
                    background: white;
                    box-shadow: 0 12px 24px rgba(0,0,0,0.06);
                    border-color: #4f46e5;
                }
                .job-card-title { 
                    font-weight: 800; 
                    color: #1e293b; 
                    margin-bottom: 6px;
                    font-size: 1.1rem;
                }
                .job-card-meta {
                    font-size: 0.85rem;
                    color: #6366f1;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.025em;
                }
                .job-card-badge {
                    display: inline-block;
                    margin-top: 12px;
                    padding: 4px 10px;
                    background: #f1f5f9;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #475569;
                }
            `}</style>
        </div>
    );
};

const styles = {
    page: {
        minHeight: "100vh",
        padding: "60px 24px",
        position: "relative",
        fontFamily: "'Outfit', 'Inter', sans-serif",
        color: "#1e293b",
        background: "#f8fafc"
    },
    backgroundBlur: {
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: `
            radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 100% 0%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)
        `,
        zIndex: -1,
    },
    container: {
        maxWidth: "1300px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1
    },
    header: {
        textAlign: "center",
        marginBottom: "64px"
    },
    title: {
        fontSize: "3.5rem",
        fontWeight: "900",
        marginBottom: "16px",
        letterSpacing: "-0.04em",
        color: "#0f172a",
        lineHeight: 1
    },
    titleGradient: {
        background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    subtitle: {
        fontSize: "1.25rem",
        color: "#64748b",
        maxWidth: "600px",
        margin: "0 auto",
        lineHeight: 1.6,
        fontWeight: "500"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "400px 1fr",
        gap: "40px",
        alignItems: "start",
    },
    leftCol: {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        position: "sticky",
        top: "40px"
    },
    rightCol: {
        minHeight: "600px"
    },
    glassCard: {
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.7)",
        borderRadius: "32px",
        padding: "32px",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
    },
    uploadArea: {
        border: "2px dashed #e2e8f0",
        borderRadius: "24px",
        padding: "48px 24px",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
        background: "rgba(248, 250, 252, 0.5)",
        display: "block"
    },
    uploadIconWrap: {
        width: "72px",
        height: "72px",
        background: "white",
        borderRadius: "24px",
        display: "grid",
        placeItems: "center",
        margin: "0 auto 20px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
        color: "#4f46e5"
    },
    uploadTitle: {
        fontSize: "1.1rem",
        fontWeight: "800",
        color: "#1e293b",
        marginBottom: "6px"
    },
    uploadSubtitle: {
        fontSize: "0.9rem",
        color: "#64748b",
        fontWeight: "500"
    },
    divider: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px"
    },
    dividerText: {
        fontSize: "0.7rem",
        fontWeight: "900",
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: "0.1em"
    },
    textarea: {
        width: "100%",
        padding: "20px",
        borderRadius: "20px",
        border: "1px solid #e2e8f0",
        background: "white",
        resize: "none",
        fontSize: "0.95rem",
        fontFamily: "inherit",
        outline: "none",
        transition: "all 0.2s ease",
        color: "#334155"
    },
    button: {
        width: "100%",
        padding: "18px",
        borderRadius: "20px",
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        border: "none",
        color: "white",
        fontSize: "1.1rem",
        fontWeight: "800",
        cursor: "pointer",
        boxShadow: "0 10px 25px rgba(79, 70, 229, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px"
    },
    btnContent: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px"
    },
    tipHeader: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "12px"
    },
    tipTitle: {
        fontSize: "0.85rem",
        fontWeight: "900",
        color: "#854d0e",
        textTransform: "uppercase",
        letterSpacing: "0.05em"
    },
    tipText: {
        fontSize: "0.95rem",
        color: "#92400e",
        lineHeight: "1.6",
        fontWeight: "500"
    },
    resultsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "32px"
    },
    scoreCard: {
        background: "white",
        borderRadius: "32px",
        padding: "40px",
        display: "flex",
        alignItems: "center",
        gap: "40px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.03)",
        border: "1px solid rgba(255,255,255,0.8)",
        position: "relative",
        overflow: "hidden"
    },
    scoreRing: {
        position: "relative",
        width: "140px",
        height: "140px"
    },
    scoreValue: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "3rem",
        fontWeight: "900",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        lineHeight: 1,
        color: "#1e293b"
    },
    scoreLabel: {
        fontSize: "0.9rem",
        opacity: 0.5,
        fontWeight: "700",
        marginTop: "4px"
    },
    scoreMeta: {
        flex: 1
    },
    scoreTitle: {
        fontSize: "1.75rem",
        fontWeight: "900",
        marginBottom: "12px",
        color: "#0f172a"
    },
    scoreDesc: {
        fontSize: "1.1rem",
        color: "#64748b",
        lineHeight: 1.6,
        fontWeight: "500"
    },
    metricsGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px"
    },
    metricCard: {
        background: "white",
        borderRadius: "24px",
        padding: "24px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        border: "1px solid rgba(0,0,0,0.03)",
        boxShadow: "0 10px 20px rgba(0,0,0,0.02)"
    },
    metricLabel: {
        fontSize: "0.8rem",
        fontWeight: "800",
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: "4px"
    },
    metricValue: {
        fontSize: "1.25rem",
        fontWeight: "900",
        color: "#1e293b"
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
    },
    cardTitle: {
        fontSize: "1.25rem",
        fontWeight: "900",
        color: "#0f172a",
        letterSpacing: "-0.02em"
    },
    iconBtn: {
        background: "#f1f5f9",
        border: "none",
        cursor: "pointer",
        color: "#4f46e5",
        padding: "10px",
        borderRadius: "12px",
        display: "grid",
        placeItems: "center",
        transition: "all 0.2s ease"
    },
    summaryText: {
        fontSize: "1.1rem",
        lineHeight: "1.8",
        color: "#334155",
        fontWeight: "500"
    },
    htmlContent: {
        fontSize: "1rem"
    },
    placeholderCard: {
        background: "white",
        border: "2px dashed #e2e8f0",
        borderRadius: "40px",
        padding: "80px 40px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "500px"
    },
    placeholderIcon: {
        width: "96px",
        height: "96px",
        background: "#f8fafc",
        borderRadius: "32px",
        display: "grid",
        placeItems: "center",
        marginBottom: "32px",
        color: "#cbd5e1"
    },
    placeholderTitle: {
        fontSize: "1.75rem",
        fontWeight: "900",
        color: "#334155",
        marginBottom: "16px"
    },
    placeholderText: {
        fontSize: "1.1rem",
        color: "#64748b",
        maxWidth: "340px",
        lineHeight: 1.6,
        fontWeight: "500"
    },
    "@media (max-width: 1100px)": {
        grid: {
            gridTemplateColumns: "1fr"
        },
        leftCol: {
            position: "static"
        }
    }
};

export default ResumeAnalyzer;
