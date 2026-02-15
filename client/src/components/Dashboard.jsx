import React from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ArrowRight, AlertCircle, Clock, Zap, TrendingUp, Award, Target, ChevronRight } from "lucide-react";

const Dashboard = ({ user }) => {
    const navigate = useNavigate();

    const skills = [
        { name: "DSA", level: 85 },
        { name: "System Design", level: 45, weak: true },
        { name: "Backend", level: 78 },
        { name: "Frontend", level: 62 },
        { name: "CS Fundamentals", level: 92 },
    ];

    const companies = [
        { name: "Google", match: 88, missing: ["System Design"], color: "#ea4335" },
        { name: "Amazon", match: 94, missing: ["Leadership Principles"], color: "#f97316" },
        { name: "Microsoft", match: 82, missing: ["Low Level Design"], color: "#0ea5e9" },
    ];

    return (
        <div style={styles.page}>
            <div style={styles.backgroundBlur} />

            <div style={styles.container}>
                {/* HEADER / WELCOME */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={styles.welcomeSection}
                >
                    <div style={styles.welcomeText}>
                        <h1 className="greeting-mobile" style={styles.greeting}>
                            Hello, <span style={styles.gradientText}>{user?.name?.split(" ")[0] || "Student"}</span> 👋
                        </h1>
                        <p style={styles.subGreeting}>
                            Ready to crush your goals today? You're on a roll! 🚀
                        </p>
                    </div>
                </motion.div>

                {/* DASHBOARD GRID */}
                <div className="dashboard-grid-mobile" style={styles.dashboardGrid}>

                    {/* LEFT COLUMN */}
                    <div style={styles.colLeft}>
                        {/* FEATURED: TODAY'S FOCUS */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            style={styles.featuredCard}
                        >
                            <div style={styles.cardHeader}>
                                <div style={styles.badge}>
                                    <Zap size={14} fill="currentColor" /> DAILY FOCUS
                                </div>
                                <div style={styles.timeTag}>
                                    <Clock size={14} /> ~45 min
                                </div>
                            </div>

                            <h2 className="featured-title-mobile" style={styles.featuredTitle}>Master System Design Basics</h2>
                            <p style={styles.featuredDesc}>
                                Your mock interview data suggests this is your biggest lever for MAANG improvement right now.
                            </p>

                            <div style={styles.actionRow}>
                                <button onClick={() => navigate("/roadmap")} style={styles.primaryBtn}>
                                    Start Session <ArrowRight size={18} />
                                </button>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                                    +7% Match Impact
                                </div>
                            </div>
                        </motion.div>

                        {/* SKILLS MATRIX */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            style={styles.glassCard}
                        >
                            <div style={styles.cardHeading}>
                                <ActivityIcon />
                                <h3>Skill Matrix</h3>
                            </div>

                            <div style={styles.skillsList}>
                                {skills.map((skill, i) => (
                                    <div key={skill.name} style={styles.skillItem}>
                                        <div style={styles.skillInfo}>
                                            <span style={styles.skillName}>{skill.name}</span>
                                            {skill.weak && <span style={styles.alertBadge}>Focus</span>}
                                        </div>
                                        <div style={styles.progressTrack}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${skill.level}%` }}
                                                transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                                                style={{
                                                    ...styles.progressBar,
                                                    background: skill.weak ? "linear-gradient(90deg, #f87171, #ef4444)" : "linear-gradient(90deg, #4f46e5, #06b6d4)"
                                                }}
                                            />
                                        </div>
                                        <div style={styles.skillLevel}>{skill.level}%</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div style={styles.colRight}>
                        {/* OVERALL READINESS SCORE */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            style={styles.scoreCard}
                        >
                            <div style={styles.scoreCircle}>
                                <svg width="120" height="120" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                                    <motion.circle
                                        cx="60" cy="60" r="54" fill="none" stroke="#fff" strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeDasharray="339.292"
                                        initial={{ strokeDashoffset: 339.292 }}
                                        animate={{ strokeDashoffset: 339.292 * (1 - 0.72) }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                                    />
                                </svg>
                                <div style={styles.scoreNumber}>72%</div>
                            </div>
                            <div style={styles.scoreText}>
                                <h3>Market Readiness</h3>
                                <p>Top 28% of candidates</p>
                            </div>
                        </motion.div>

                        {/* COMPANY TARGETS */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            style={styles.glassCard}
                        >
                            <div style={styles.cardHeading}>
                                <TargetIcon />
                                <h3>Dream Companies</h3>
                            </div>

                            <div style={styles.companiesList}>
                                {companies.map((c) => (
                                    <div key={c.name} style={styles.companyRow}>
                                        <div style={{ ...styles.companyLogo, background: c.color }}>
                                            {c.name[0]}
                                        </div>
                                        <div style={styles.companyInfo}>
                                            <div style={styles.companyName}>
                                                {c.name} <span style={styles.matchBadge}>{c.match}% Match</span>
                                            </div>
                                            <div style={styles.missingGap}>
                                                <AlertCircle size={10} color="#f59e0b" style={{ marginRight: 4 }} />
                                                Gap: {c.missing[0]}
                                            </div>
                                        </div>
                                        <button style={styles.iconBtn}>
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => navigate("/resume")} style={styles.viewMoreBtn}>
                                View Detailed Analysis
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple Icons
const ActivityIcon = () => <TrendingUp size={20} color="#4f46e5" style={{ marginRight: 10 }} />;
const TargetIcon = () => <Target size={20} color="#e11d48" style={{ marginRight: 10 }} />;

const styles = {
    page: {
        minHeight: "100vh",
        padding: "32px",
        fontFamily: "'Inter', sans-serif",
        color: "#1e293b",
        position: "relative"
    },
    backgroundBlur: {
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 60%, rgba(14, 165, 233, 0.05) 0%, transparent 40%)",
        zIndex: -1,
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
    },
    welcomeSection: {
        marginBottom: "40px",
    },
    greeting: {
        fontSize: "2rem",
        fontWeight: "900",
        color: "#0f172a",
        marginBottom: "8px",
        letterSpacing: "-0.02em"
    },
    gradientText: {
        background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    subGreeting: {
        fontSize: "1.1rem",
        color: "#64748b",
    },
    dashboardGrid: {
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr",
        gap: "32px",
        alignItems: "start",
    },
    colLeft: {
        display: "flex",
        flexDirection: "column",
        gap: "32px",
    },
    colRight: {
        display: "flex",
        flexDirection: "column",
        gap: "32px",
    },
    featuredCard: {
        background: "white",
        borderRadius: "24px",
        padding: "32px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.04)",
        border: "1px solid rgba(0,0,0,0.03)",
        position: "relative",
        overflow: "hidden"
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px"
    },
    badge: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        background: "#eff6ff",
        color: "#2563eb",
        borderRadius: "100px",
        fontSize: "0.75rem",
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: "0.05em"
    },
    timeTag: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        color: "#64748b",
        fontSize: "0.85rem",
        fontWeight: "600"
    },
    featuredTitle: {
        fontSize: "2rem",
        fontWeight: "900",
        color: "#1e293b",
        marginBottom: "12px",
        lineHeight: 1.2
    },
    featuredDesc: {
        fontSize: "1.1rem",
        color: "#475569",
        lineHeight: 1.6,
        marginBottom: "32px"
    },
    actionRow: {
        display: "flex",
        alignItems: "center",
        gap: "24px"
    },
    primaryBtn: {
        padding: "16px 32px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
        color: "white",
        fontSize: "1rem",
        fontWeight: "700",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow: "0 10px 20px rgba(37, 99, 235, 0.2)",
        transition: "all 0.2s"
    },
    glassCard: {
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "24px",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        padding: "24px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
    },
    cardHeading: {
        display: "flex",
        alignItems: "center",
        marginBottom: "24px",
        fontSize: "1.1rem",
        fontWeight: "800",
        color: "#0f172a"
    },
    skillsList: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },
    skillItem: {
        display: "flex",
        alignItems: "center",
        gap: "16px"
    },
    skillInfo: {
        width: "140px",
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },
    skillName: {
        fontSize: "0.9rem",
        fontWeight: "600",
        color: "#334155"
    },
    alertBadge: {
        fontSize: "0.6rem",
        background: "#fef2f2",
        color: "#ef4444",
        padding: "2px 6px",
        borderRadius: "4px",
        fontWeight: "800",
        textTransform: "uppercase"
    },
    progressTrack: {
        flex: 1,
        height: "8px",
        background: "#f1f5f9",
        borderRadius: "10px",
        overflow: "hidden"
    },
    progressBar: {
        height: "100%",
        borderRadius: "10px"
    },
    skillLevel: {
        width: "40px",
        textAlign: "right",
        fontSize: "0.85rem",
        fontWeight: "700",
        color: "#64748b"
    },
    scoreCard: {
        background: "linear-gradient(135deg, #4f46e5, #4338ca)",
        borderRadius: "24px",
        padding: "32px",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "24px",
        boxShadow: "0 20px 40px rgba(67, 56, 202, 0.3)",
        position: "relative",
        overflow: "hidden"
    },
    scoreCircle: {
        position: "relative",
        width: "120px",
        height: "120px"
    },
    scoreNumber: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "2rem",
        fontWeight: "900"
    },
    scoreText: {
        flex: 1
    },
    companiesList: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },
    companyRow: {
        display: "flex",
        alignItems: "center",
        padding: "16px",
        background: "rgba(255,255,255,0.5)",
        borderRadius: "16px",
        gap: "16px",
        transition: "all 0.2s",
        border: "1px solid transparent"
    },
    companyLogo: {
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        display: "grid",
        placeItems: "center",
        color: "white",
        fontWeight: "900",
        fontSize: "1.2rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    },
    companyInfo: {
        flex: 1
    },
    companyName: {
        fontSize: "1rem",
        fontWeight: "700",
        color: "#1e293b",
        marginBottom: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    matchBadge: {
        fontSize: "0.8rem",
        color: "#16a34a",
        background: "#dcfce7",
        padding: "2px 8px",
        borderRadius: "6px"
    },
    missingGap: {
        fontSize: "0.80rem",
        color: "#64748b",
        display: "flex",
        alignItems: "center"
    },
    iconBtn: {
        background: "transparent",
        border: "none",
        color: "#94a3b8",
        cursor: "pointer",
        padding: "8px"
    },
    viewMoreBtn: {
        width: "100%",
        marginTop: "20px",
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        background: "transparent",
        color: "#475569",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s"
    },
    // MOBILE OVERRIDES
    '@media (max-width: 900px)': {
        dashboardGrid: {
            gridTemplateColumns: "1fr",
            gap: "24px"
        },
        greeting: {
            fontSize: "1.5rem"
        },
        featuredTitle: {
            fontSize: "1.5rem"
        },
        page: {
            padding: "16px"
        },
        featuredCard: {
            padding: "24px"
        }
    }
};

// Injecting media styles directly for simplicity since it's using a style object
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @media (max-width: 900px) {
            .dashboard-grid-mobile {
                grid-template-columns: 1fr !important;
                gap: 24px !important;
            }
            .greeting-mobile {
                font-size: 1.5rem !important;
            }
            .featured-title-mobile {
                font-size: 1.5rem !important;
            }
        }
    `;
    document.head.appendChild(styleSheet);
}

export default Dashboard;
