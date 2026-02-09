import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Map,
    BrainCircuit,
    FileText,
    GraduationCap,
    Zap,
    LogOut,
    Sparkles,
    Bell,
} from "lucide-react";

const AppShell = ({ children, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/courses", label: "Academy", icon: GraduationCap },
        { path: "/roadmap", label: "Roadmap", icon: Map },
        { path: "/resume", label: "Resume", icon: FileText },
        { path: "/mentor", label: "AI Mentor", icon: BrainCircuit },
        { path: "/opportunities", label: "Jobs", icon: Sparkles },
        { path: "/quiz", label: "Quiz", icon: Zap },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div style={styles.app}>
            {/* TOP NAVBAR */}
            <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                style={styles.nav}
            >
                {/* LOGO */}
                <div style={styles.logoWrap}>
                    <div style={styles.logo}>
                        <Sparkles size={18} />
                    </div>
                    <span style={styles.brand}>AI STUDENT GUIDE HUB</span>
                </div>

                {/* DESKTOP NAV */}
                <div className="desktop-nav" style={styles.navGroup}>
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                style={{
                                    ...styles.navItem,
                                    color: active ? "#ffffff" : "#475569",
                                }}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        style={styles.navPill}
                                        transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                                    />
                                )}
                                <Icon size={16} strokeWidth={active ? 2.6 : 2} />
                                <span>{item.label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* RIGHT ACTIONS */}
                <div style={styles.actions}>
                    <div style={styles.notification}>
                        <Bell size={18} />
                        <span style={styles.dot} />
                    </div>

                    <div style={styles.divider} />

                    <button onClick={onLogout} style={styles.logout}>
                        <LogOut size={15} />
                        Logout
                    </button>
                </div>
            </motion.nav>

            {/* MAIN CONTENT */}
            <main style={styles.main}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* FOOTER */}
            <footer style={styles.footer}>
                © 2026 Road2Success · Designed for students
            </footer>

            {/* MOBILE CSS */}
            <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
        </div>
    );
};

/* ==========================
   STYLES — APPLE GLASS UI
========================== */
const styles = {
    app: {
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui",
    },

    nav: {
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: "68px",
        padding: "0 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        background:
            "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.75))",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",

        borderBottom: "1px solid rgba(0,0,0,0.06)",
    },

    logoWrap: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },

    logo: {
        width: "34px",
        height: "34px",
        borderRadius: "10px",
        background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
        display: "grid",
        placeItems: "center",
        color: "#ffffff",
    },

    brand: {
        fontSize: "1.1rem",
        fontWeight: 700,
        letterSpacing: "-0.02em",
        color: "#0f172a",
    },

    navGroup: {
        display: "flex",
        gap: "6px",
        padding: "6px",
        borderRadius: "999px",
        background: "rgba(0,0,0,0.04)",
    },

    navItem: {
        position: "relative",
        padding: "8px 16px",
        borderRadius: "999px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        fontSize: "0.85rem",
        fontWeight: 600,
        zIndex: 1,
    },

    navPill: {
        position: "absolute",
        inset: 0,
        background: "#0f172a",
        borderRadius: "999px",
        zIndex: -1,
        boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
    },

    actions: {
        display: "flex",
        alignItems: "center",
        gap: "18px",
    },

    notification: {
        position: "relative",
        cursor: "pointer",
        color: "#475569",
    },

    dot: {
        position: "absolute",
        top: "-2px",
        right: "-2px",
        width: "8px",
        height: "8px",
        background: "#ef4444",
        borderRadius: "50%",
        border: "2px solid #ffffff",
    },

    divider: {
        width: "1px",
        height: "22px",
        background: "rgba(0,0,0,0.12)",
    },

    logout: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 14px",
        borderRadius: "12px",
        border: "1px solid rgba(0,0,0,0.06)",
        background: "#ffffff",
        color: "#ef4444",
        fontWeight: 600,
        fontSize: "0.85rem",
        cursor: "pointer",
    },

    main: {
        flex: 1,
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "28px",
        boxSizing: "border-box",
    },

    footer: {
        padding: "22px",
        fontSize: "0.8rem",
        textAlign: "center",
        color: "#94a3b8",
        borderTop: "1px solid rgba(0,0,0,0.06)",
    },
};

export default AppShell;
