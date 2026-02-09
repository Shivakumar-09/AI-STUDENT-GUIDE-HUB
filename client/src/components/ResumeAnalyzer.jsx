import React, { useState } from "react";
import axios from "axios";
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
        const formData = new FormData();
        file
            ? formData.append("file", file)
            : formData.append("fallback_text", text);

        try {
            // Updated port to 5000 based on standard setup, or keep 8000 if python backend is used
            const res = await axios.post(
                "http://localhost:5000/api/resume-analyze",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setAnalysis(res.data);
        } catch (err) {
            console.warn("Primary API failed, trying fallback...", err);
            // Fallback to 8000 if 5000 fails (for python backend)
            try {
                const res = await axios.post(
                    "http://localhost:8000/api/resume-analyze",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                setAnalysis(res.data);
            } catch (e) {
                console.error("Fallback API also failed:", e);
                alert("Could not connect to analysis server. Please ensure backend is running.");
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
                                <span style={styles.dividerText}>OR PASTE TEXT</span>
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
                .html-content ul { padding-left: 20px; margin: 10px 0; }
                .html-content li { margin-bottom: 8px; color: #334155; }
                .html-content strong { color: #1e293b; font-weight: 700; }
                
                /* Job Cards Internal Styling */
                .job-grid { 
                    display: grid; 
                    gap: 20px; 
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
                    margin-top: 16px;
                }
                .job-card { 
                    background: rgba(255, 255, 255, 0.15); 
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.3); 
                    padding: 20px; 
                    border-radius: 20px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    position: relative;
                    overflow: hidden;
                }
                .job-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; height: 100%;
                    background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%);
                    pointer-events: none;
                    opacity: 0.5;
                }
                .job-card:hover { 
                    background: rgba(255, 255, 255, 0.25); 
                    transform: translateY(-5px); 
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255,255,255,0.5); 
                }
                .job-title { 
                    font-size: 1.1rem;
                    font-weight: 800; 
                    color: #0f172a; 
                    margin-bottom: 8px;
                    line-height: 1.3;
                    position: relative;
                }
                .job-company { 
                    font-size: 0.9rem; 
                    color: #475569; 
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    position: relative;
                }
            `}</style>
        </div>
    );
};

const styles = {
    page: {
        minHeight: "100vh",
        padding: "40px 24px",
        position: "relative",
        fontFamily: "'Inter', sans-serif",
        color: "#1e293b",
        overflow: "hidden"
    },
    backgroundBlur: {
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(14, 165, 233, 0.1) 0%, transparent 40%)",
        zIndex: -1,
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1
    },
    header: {
        textAlign: "center",
        marginBottom: "48px"
    },
    title: {
        fontSize: "2.5rem",
        fontWeight: "900",
        marginBottom: "12px",
        letterSpacing: "-0.03em",
        color: "#0f172a"
    },
    titleGradient: {
        background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    subtitle: {
        fontSize: "1.1rem",
        color: "#64748b",
        maxWidth: "600px",
        margin: "0 auto",
        lineHeight: 1.6
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1.5fr",
        gap: "32px",
        alignItems: "start",
    },
    leftCol: {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        position: "sticky",
        top: "24px"
    },
    rightCol: {
        minHeight: "500px"
    },
    glassCard: {
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        borderRadius: "24px",
        padding: "32px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    uploadArea: {
        border: "2px dashed #e0e7ff",
        borderRadius: "16px",
        padding: "40px 20px",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
        background: "rgba(255,255,255,0.5)",
    },
    uploadIconWrap: {
        width: "64px",
        height: "64px",
        background: "#e0e7ff",
        borderRadius: "20px",
        display: "grid",
        placeItems: "center",
        margin: "0 auto 16px"
    },
    uploadTitle: {
        fontSize: "1rem",
        fontWeight: "700",
        color: "#1e293b",
        marginBottom: "4px"
    },
    uploadSubtitle: {
        fontSize: "0.85rem",
        color: "#64748b"
    },
    divider: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "8px 0"
    },
    dividerText: {
        fontSize: "0.75rem",
        fontWeight: "800",
        color: "#94a3b8",
        background: "#f8fafc", // fallback
        padding: "4px 12px",
        borderRadius: "99px",
        letterSpacing: "0.05em"
    },
    textarea: {
        width: "100%",
        padding: "16px",
        borderRadius: "16px",
        border: "1px solid rgba(0,0,0,0.1)",
        background: "rgba(255,255,255,0.5)",
        resize: "none",
        fontSize: "0.9rem",
        fontFamily: "inherit",
        outline: "none",
        transition: "0.2s"
    },
    button: {
        width: "100%",
        padding: "16px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
        border: "none",
        color: "white",
        fontSize: "1rem",
        fontWeight: "700",
        cursor: "pointer",
        boxShadow: "0 10px 20px rgba(79, 70, 229, 0.3)",
        position: "relative",
        overflow: "hidden"
    },
    btnContent: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px"
    },
    tipHeader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "8px"
    },
    tipTitle: {
        fontSize: "0.85rem",
        fontWeight: "800",
        color: "#ca8a04",
        textTransform: "uppercase"
    },
    tipText: {
        fontSize: "0.9rem",
        color: "#854d0e",
        lineHeight: "1.5"
    },
    resultsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "24px"
    },
    scoreCard: {
        background: "linear-gradient(135deg, #1e1b4b, #312e81)",
        borderRadius: "24px",
        padding: "32px",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "32px",
        boxShadow: "0 20px 40px rgba(30, 27, 75, 0.4)",
        border: "1px solid rgba(255,255,255,0.1)"
    },
    scoreRing: {
        position: "relative",
        width: "120px",
        height: "120px"
    },
    scoreValue: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "2.5rem",
        fontWeight: "800",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        lineHeight: 1
    },
    scoreLabel: {
        fontSize: "0.85rem",
        opacity: 0.7,
        fontWeight: "600",
        marginTop: "4px"
    },
    scoreMeta: {
        flex: 1
    },
    scoreTitle: {
        fontSize: "1.5rem",
        fontWeight: "800",
        marginBottom: "8px"
    },
    scoreDesc: {
        fontSize: "1rem",
        opacity: 0.9,
        lineHeight: 1.5,
        maxWidth: "300px"
    },
    metricsGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px"
    },
    metricCard: {
        background: "white",
        borderRadius: "16px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 4px 10px rgba(0,0,0,0.02)"
    },
    metricLabel: {
        fontSize: "0.75rem",
        fontWeight: "700",
        color: "#94a3b8",
        textTransform: "uppercase"
    },
    metricValue: {
        fontSize: "1rem",
        fontWeight: "800",
        color: "#1e293b"
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px"
    },
    cardTitle: {
        fontSize: "1.1rem",
        fontWeight: "800",
        color: "#0f172a"
    },
    iconBtn: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "#6366f1",
        padding: "8px",
        borderRadius: "8px",
        display: "grid",
        placeItems: "center",
        transition: "0.2s"
    },
    summaryText: {
        fontSize: "1rem",
        lineHeight: "1.7",
        color: "#334155"
    },
    htmlContent: {
        fontSize: "0.95rem",
        lineHeight: "1.6",
        color: "#334155"
    },
    placeholderCard: {
        background: "rgba(255,255,255,0.4)",
        border: "2px dashed rgba(0,0,0,0.05)",
        borderRadius: "24px",
        padding: "64px 32px",
        textAlign: "center",
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px"
    },
    placeholderIcon: {
        width: "80px",
        height: "80px",
        background: "white",
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        marginBottom: "24px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
    },
    placeholderTitle: {
        fontSize: "1.5rem",
        fontWeight: "800",
        color: "#94a3b8",
        marginBottom: "12px"
    },
    placeholderText: {
        color: "#94a3b8",
        maxWidth: "300px",
        lineHeight: 1.5
    },
    "@media (max-width: 900px)": {
        grid: {
            gridTemplateColumns: "1fr"
        },
        leftCol: {
            position: "static"
        }
    }
};

export default ResumeAnalyzer;
