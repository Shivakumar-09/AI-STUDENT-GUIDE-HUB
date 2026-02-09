import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from '../config/api';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Timer, CheckCircle, ArrowRight, Activity, Zap } from "lucide-react";

/* =====================
   QUESTION BANK
===================== */
const QUESTION_BANK = [
    { q: "Which data structure follows LIFO?", options: ["Queue", "Stack", "Heap", "Tree"], a: 1 },
    { q: "Time complexity of Binary Search?", options: ["O(n)", "O(log n)", "O(1)", "O(n²"], a: 1 },
    { q: "Which is NOT a programming language?", options: ["Python", "Java", "HTTP", "C++"], a: 2 },
    { q: "Which keyword is used to inherit a class in Java?", options: ["this", "super", "extends", "implements"], a: 2 },
    { q: "Which data structure is used in BFS?", options: ["Stack", "Queue", "Tree", "Set"], a: 1 },
    { q: "What does SQL stand for?", options: ["Simple Query Lang", "Structured Query Language", "Server Query Lang", "None"], a: 1 },
    { q: "Which sorting algorithm is fastest on average?", options: ["Bubble", "Selection", "Quick", "Insertion"], a: 2 },
    { q: "Which is mutable in Python?", options: ["tuple", "string", "list", "int"], a: 2 },
    { q: "Which HTTP method is idempotent?", options: ["POST", "PUT", "PATCH", "CONNECT"], a: 1 },
    { q: "Which principle is used in OOPS?", options: ["Recursion", "Encapsulation", "Compilation", "Linking"], a: 1 },
];

/* =====================
   UTIL: SHUFFLE ARRAY
===================== */
const shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

const Quiz = () => {
    const [userName, setUserName] = useState("");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);

    /* LOAD RANDOM QUESTIONS */
    useEffect(() => {
        const selected = shuffle(QUESTION_BANK).slice(0, 5); // Take 5 for a quick quiz
        setQuestions(selected);
        setAnswers(new Array(selected.length).fill(null));
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/leaderboard`);
            setLeaderboard(res.data);
        } catch (e) { console.error("Leaderboard fetch failed", e); }
    };

    const submitQuiz = async () => {
        if (!userName.trim()) {
            alert("Please enter your name to submit!");
            return;
        }

        let sc = 0;
        answers.forEach((ans, i) => {
            if (ans === questions[i].a) sc++;
        });

        setScore(sc);

        try {
            await axios.post(`${API_URL}/api/leaderboard`, {
                name: userName,
                score: sc,
            });
            fetchLeaderboard();
        } catch (e) {
            console.error("Submission failed", e);
            alert("Failed to submit score. Check backend.");
        }
    };

    const progress = (answers.filter((a) => a !== null).length / questions.length) * 100;

    return (
        <div style={styles.page}>
            <div style={styles.backgroundBlur} />

            <div style={styles.container}>
                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={styles.header}
                >
                    <div style={styles.badge}>
                        <Zap size={14} fill="currentColor" /> Technical Interview Prep
                    </div>
                    <h1 style={styles.title}>Mastery <span style={styles.textGradient}>Quiz</span></h1>
                    <p style={styles.subtitle}>
                        Test your knowledge against MAANG standards.
                    </p>
                </motion.div>

                <div style={styles.grid}>
                    {/* LEFT: QUIZ */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        style={styles.glassCard}
                    >
                        <div style={styles.quizHeader}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Candidate Name</label>
                                <input
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Enter your name..."
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.progressContainer}>
                                <div style={styles.progressHeader}>
                                    <span style={styles.progressLabel}>Completion</span>
                                    <span style={styles.progressValue}>{Math.round(progress)}%</span>
                                </div>
                                <div style={styles.progressTrack}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        style={styles.progressBar}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* QUESTIONS */}
                        <div style={styles.questionsList}>
                            {questions.map((q, qi) => (
                                <motion.div
                                    key={qi}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (qi * 0.1) }}
                                    style={styles.questionBlock}
                                >
                                    <div style={styles.questionText}>
                                        <span style={styles.qIndex}>{qi + 1}</span>
                                        {q.q}
                                    </div>
                                    <div style={styles.optionGrid}>
                                        {q.options.map((op, oi) => (
                                            <button
                                                key={oi}
                                                onClick={() => {
                                                    const copy = [...answers];
                                                    copy[qi] = oi;
                                                    setAnswers(copy);
                                                }}
                                                style={{
                                                    ...styles.optionBtn,
                                                    ...(answers[qi] === oi ? styles.optionBtnActive : {}),
                                                }}
                                            >
                                                {answers[qi] === oi && <CheckCircle size={16} />}
                                                {op}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(37, 99, 235, 0.2)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={submitQuiz}
                            disabled={score !== null}
                            style={{
                                ...styles.submitBtn,
                                opacity: score !== null ? 0.5 : 1,
                                cursor: score !== null ? "default" : "pointer"
                            }}
                        >
                            {score !== null ? "Submitted" : "Finalize & Submit Score"} <ArrowRight size={20} />
                        </motion.button>

                        <AnimatePresence>
                            {score !== null && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={styles.scoreBox}
                                >
                                    <div style={styles.scoreLabel}>Your Result</div>
                                    <div style={styles.scoreValue}>{score} <span style={{ fontSize: '1.5rem', opacity: 0.6 }}>/ {questions.length}</span></div>
                                    <p style={styles.scoreMsg}>
                                        {score === questions.length ? "Perfect Score! 🚀" : "Keep practicing to improve!"}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* RIGHT: LEADERBOARD */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        style={styles.glassCard}
                    >
                        <div style={styles.lbHeader}>
                            <Trophy size={24} color="#ca8a04" />
                            <h3>Top Performers</h3>
                        </div>

                        <div style={styles.lbList}>
                            {leaderboard.length === 0 ? (
                                <div style={styles.emptyState}>No records yet. Be the first!</div>
                            ) : (
                                leaderboard.map((l, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + (i * 0.05) }}
                                        style={{
                                            ...styles.lbItem,
                                            ...(i === 0 ? styles.lbItemFirst : {})
                                        }}
                                    >
                                        <div style={styles.lbRank}>
                                            {i === 0 ? "👑" : `#${i + 1}`}
                                        </div>
                                        <div style={styles.lbInfo}>
                                            <div style={styles.lbName}>{l.name}</div>
                                            <div style={styles.lbDate}>{new Date(l.date).toLocaleDateString()}</div>
                                        </div>
                                        <div style={styles.lbScore}>{l.score}</div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            <style>{`
                ::placeholder { color: #94a3b8; }
            `}</style>
        </div>
    );
};

/* =====================
   STYLES
===================== */
const styles = {
    page: {
        minHeight: "100vh",
        padding: "40px 24px",
        fontFamily: "'Inter', system-ui, sans-serif",
        color: "#1e293b",
        position: "relative",
    },
    backgroundBlur: {
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 25%), radial-gradient(circle at 85% 30%, rgba(14, 165, 233, 0.08) 0%, transparent 25%)",
        zIndex: -1,
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
    },
    header: {
        textAlign: "center",
        marginBottom: "48px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    badge: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "99px",
        background: "rgba(99, 102, 241, 0.1)",
        color: "#4f46e5",
        fontSize: "0.75rem",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: "16px"
    },
    title: {
        fontSize: "2.5rem",
        fontWeight: "900",
        letterSpacing: "-0.02em",
        marginBottom: "12px",
        color: "#0f172a"
    },
    textGradient: {
        background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    subtitle: {
        fontSize: "1.1rem",
        color: "#64748b",
        maxWidth: "500px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "32px",
        alignItems: "start",
    },
    glassCard: {
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "24px",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        padding: "32px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.03)",
    },
    quizHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "32px",
        paddingBottom: "24px",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        gap: "40px"
    },
    inputGroup: {
        flex: 1,
    },
    label: {
        display: "block",
        fontSize: "0.85rem",
        fontWeight: "700",
        color: "#64748b",
        marginBottom: "8px",
        textTransform: "uppercase",
        letterSpacing: "0.02em"
    },
    input: {
        width: "100%",
        padding: "14px 16px",
        borderRadius: "12px",
        border: "1px solid #cbd5e1",
        background: "rgba(255,255,255,0.8)",
        fontSize: "1rem",
        fontWeight: "600",
        color: "#0f172a",
        outline: "none",
        transition: "all 0.2s"
    },
    progressContainer: {
        flex: 1,
    },
    progressHeader: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px"
    },
    progressLabel: {
        fontSize: "0.85rem",
        fontWeight: "600",
        color: "#64748b"
    },
    progressValue: {
        fontSize: "0.85rem",
        fontWeight: "700",
        color: "#4f46e5"
    },
    progressTrack: {
        height: "8px",
        background: "#e2e8f0",
        borderRadius: "10px",
        overflow: "hidden"
    },
    progressBar: {
        height: "100%",
        background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
        borderRadius: "10px"
    },
    questionsList: {
        display: "flex",
        flexDirection: "column",
        gap: "32px"
    },
    questionBlock: {
    },
    questionText: {
        fontSize: "1.2rem",
        fontWeight: "700",
        color: "#1e293b",
        marginBottom: "16px",
        display: "flex",
        gap: "12px",
        lineHeight: 1.4
    },
    qIndex: {
        display: "grid",
        placeItems: "center",
        minWidth: "28px",
        height: "28px",
        background: "#0f172a",
        color: "white",
        fontSize: "0.8rem",
        fontWeight: "bold",
        borderRadius: "8px",
        marginTop: "2px"
    },
    optionGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
    },
    optionBtn: {
        padding: "16px",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
        background: "rgba(255,255,255,0.5)",
        color: "#475569",
        fontSize: "0.95rem",
        fontWeight: "600",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },
    optionBtnActive: {
        background: "#eff6ff",
        borderColor: "#3b82f6",
        color: "#1d4ed8",
        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.1)"
    },
    submitBtn: {
        width: "100%",
        padding: "20px",
        marginTop: "40px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #16a34a, #059669)",
        color: "white",
        fontSize: "1.1rem",
        fontWeight: "800",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        boxShadow: "0 10px 20px rgba(22, 163, 74, 0.2)",
    },
    scoreBox: {
        marginTop: "32px",
        padding: "32px",
        background: "linear-gradient(135deg, #ecfeff, #cffafe)",
        borderRadius: "20px",
        textAlign: "center",
        border: "1px solid #a5f3fc"
    },
    scoreLabel: {
        textTransform: "uppercase",
        fontSize: "0.85rem",
        fontWeight: "800",
        color: "#0891b2",
        marginBottom: "8px"
    },
    scoreValue: {
        fontSize: "3.5rem",
        fontWeight: "900",
        color: "#164e63",
        lineHeight: 1
    },
    scoreMsg: {
        marginTop: "12px",
        color: "#155e75",
        fontWeight: "600"
    },
    lbHeader: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "24px",
        paddingBottom: "16px",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        fontWeight: "800",
        fontSize: "1.1rem"
    },
    lbList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },
    lbItem: {
        background: "rgba(255,255,255,0.5)",
        padding: "12px 16px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        border: "1px solid rgba(0,0,0,0.03)"
    },
    lbItemFirst: {
        background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
        borderColor: "#fde68a",
        boxShadow: "0 4px 12px rgba(251, 191, 36, 0.15)"
    },
    lbRank: {
        width: "28px",
        height: "28px",
        borderRadius: "8px",
        background: "#fff",
        display: "grid",
        placeItems: "center",
        fontSize: "0.8rem",
        fontWeight: "900",
        color: "#64748b",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
    },
    lbInfo: {
        flex: 1,
    },
    lbName: {
        fontSize: "0.9rem",
        fontWeight: "700",
        color: "#1e293b"
    },
    lbDate: {
        fontSize: "0.7rem",
        color: "#94a3b8"
    },
    lbScore: {
        fontSize: "1.1rem",
        fontWeight: "900",
        color: "#0f172a"
    },
    emptyState: {
        textAlign: "center",
        padding: "40px 20px",
        color: "#94a3b8",
        fontSize: "0.9rem",
        fontStyle: "italic"
    }
};

export default Quiz;
