import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight, AlertCircle, Clock, Zap, TrendingUp,
    Target, ChevronRight, BookOpen, Code2, Brain,
    BarChart3, Rocket, CheckCircle2, Sparkles, Play,
    Lock, Flame, Trophy, Star, Activity, Award,
} from "lucide-react";

/* ─── FONTS injected once ─────────────────────────────────────── */
const injectFonts = () => {
    if (document.getElementById("gh-fonts")) return;
    const s = document.createElement("style");
    s.id = "gh-fonts";
    s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
  `;
    document.head.appendChild(s);
};

/* ─── Animated counter ────────────────────────────────────────── */
function Counter({ to, suffix = "", delay = 0 }) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => {
            let start = null;
            const step = (ts) => {
                if (!start) start = ts;
                const p = Math.min((ts - start) / 1000, 1);
                const ease = 1 - Math.pow(1 - p, 4);
                setVal(Math.round(ease * to));
                if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }, delay);
        return () => clearTimeout(t);
    }, [to, delay]);
    return <>{val}{suffix}</>;
}

/* ─── Animated ring ───────────────────────────────────────────── */
function Ring({ pct, size = 96, strokeW = 8, color = "#6366f1" }) {
    const r = (size - strokeW) / 2;
    const circ = 2 * Math.PI * r;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke="rgba(99,102,241,0.12)" strokeWidth={strokeW} />
            <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={color} strokeWidth={strokeW} strokeLinecap="round"
                strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
                transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
            />
        </svg>
    );
}

/* ─── Stars ───────────────────────────────────────────────────── */
const Stars = ({ n }) => (
    <span style={{ display: "flex", gap: 2 }}>
        {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} size={9}
                fill={i <= n ? "#f59e0b" : "none"}
                color={i <= n ? "#f59e0b" : "rgba(255,255,255,0.15)"} />
        ))}
    </span>
);

/* ════════════════════════════════════════════════════════════════
   DASHBOARD  — drop-in replacement, same props as original
════════════════════════════════════════════════════════════════ */
const Dashboard = ({ user }) => {
    const navigate = useNavigate();
    injectFonts();

    const name = user?.name?.split(" ")[0] || "Student";

    /* ── data ── */
    const skills = [
        { name: "DSA", level: 85, color: "#6366f1" },
        { name: "System Design", level: 45, color: "#f43f5e", focus: true },
        { name: "Backend", level: 78, color: "#8b5cf6" },
        { name: "Frontend", level: 62, color: "#06b6d4" },
        { name: "CS Fundamentals", level: 92, color: "#10b981" },
    ];

    const companies = [
        { name: "Google", letter: "G", bg: "#ea4335", match: 88, gap: "System Design", tier: "med" },
        { name: "Amazon", letter: "A", bg: "#ff9900", match: 94, gap: "Leadership Principles", tier: "high" },
        { name: "Microsoft", letter: "M", bg: "#00a4ef", match: 82, gap: "Low Level Design", tier: "med" },
    ];

    const roadmaps = [
        { icon: <Brain size={15} />, color: "#8b5cf6", bg: "rgba(139,92,246,0.15)", name: "AI Engineer", sub: "4 / 12 modules", prog: 33 },
        { icon: <Code2 size={15} />, color: "#06b6d4", bg: "rgba(6,182,212,0.15)", name: "Full-Stack Dev", sub: "7 / 10 modules", prog: 70 },
        { icon: <BarChart3 size={15} />, color: "#10b981", bg: "rgba(16,185,129,0.15)", name: "Data Engineer", sub: "1 / 8 modules", prog: 12 },
        { icon: <Rocket size={15} />, color: "#6b7280", bg: "rgba(107,114,128,0.12)", name: "Cloud/DevOps", sub: "Locked", prog: 0, locked: true },
    ];

    const activity = [
        { icon: <CheckCircle2 size={13} />, color: "#10b981", bg: "rgba(16,185,129,0.15)", text: "Completed: Arrays & Hashing", time: "2 hr ago" },
        { icon: <Sparkles size={13} />, color: "#8b5cf6", bg: "rgba(139,92,246,0.15)", text: "Resume uploaded & analysed", time: "Yesterday" },
        { icon: <Play size={13} />, color: "#6366f1", bg: "rgba(99,102,241,0.15)", text: "Mock interview: Frontend Eng.", time: "2 days ago" },
        { icon: <Trophy size={13} />, color: "#f59e0b", bg: "rgba(245,158,11,0.15)", text: "Quiz: Python — scored 8/10", time: "3 days ago" },
    ];

    const courses = [
        { emoji: "🏗️", bg: "rgba(99,102,241,0.18)", name: "System Design Fundamentals", meta: "Coursera · 12 h", stars: 5 },
        { emoji: "📐", bg: "rgba(139,92,246,0.18)", name: "Grokking System Design", meta: "Udemy · 18 h", stars: 5 },
        { emoji: "⚙️", bg: "rgba(16,185,129,0.18)", name: "LLD Mastery for Interviews", meta: "YouTube · Free", stars: 4 },
    ];

    const subDomains = [
        { label: "Technical Skills", pct: 78, color: "#6366f1" },
        { label: "Problem Solving", pct: 85, color: "#8b5cf6" },
        { label: "System Design", pct: 45, color: "#f43f5e" },
        { label: "Communication", pct: 70, color: "#10b981" },
    ];

    const [goals, setGoals] = useState([
        { text: "Solve 3 LeetCode problems", done: true },
        { text: "Study 1 System Design chapter", done: false },
        { text: "Watch 1 lecture — Backend module", done: true },
        { text: "Update resume keywords", done: false },
        { text: "Complete daily quiz", done: false },
    ]);
    const toggle = i => setGoals(g => g.map((x, j) => j === i ? { ...x, done: !x.done } : x));
    const doneCount = goals.filter(g => g.done).length;

    /* ── shared tokens ── */
    const T = {
        font: "'Outfit', sans-serif",
        mono: "'DM Mono', monospace",
        bg: "#ffffff",
        surface: "#f8fafc",
        card: "#ffffff",
        card2: "#f1f5f9",
        border: "rgba(0,0,0,0.07)",
        border2: "rgba(0,0,0,0.12)",
        text: "#0f172a",
        muted: "#64748b",
        accent: "#6366f1",
    };

    const card = (extra = {}) => ({
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 20,
        overflow: "hidden",
        ...extra,
    });

    const pill = (bg, color, extra = {}) => ({
        display: "inline-flex", alignItems: "center", gap: 4,
        background: bg, color,
        fontSize: 10.5, fontWeight: 700,
        padding: "3px 9px", borderRadius: 20,
        ...extra,
    });

    /* ── fade-up preset ── */
    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] },
    });

    return (
        <div style={{ fontFamily: T.font, background: T.bg, minHeight: "100vh", padding: "28px 24px 60px", color: T.text, boxSizing: "border-box" }}>

            {/* subtle background circles */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-10%", left: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 65%)" }} />
                <div style={{ position: "absolute", bottom: "5%", right: "0%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 65%)" }} />
            </div>

            <div style={{ position: "relative", zIndex: 1, maxWidth: 1180, margin: "0 auto" }}>

                {/* ── GREETING ROW ── */}
                <motion.div {...fadeUp(0)} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
                    <div>
                        <h1 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.1 }}>
                            Hey, <span style={{ background: "linear-gradient(90deg,#6366f1,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{name}</span> 👋
                        </h1>
                        <p style={{ fontSize: 14, color: T.muted, marginTop: 6 }}>Ready to crack MAANG today? You're on a roll 🚀</p>
                    </div>
                    {/* streak */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 14, padding: "10px 16px" }}>
                        <Flame size={18} color="#f59e0b" fill="#f59e0b" />
                        <div>
                            <div style={{ fontFamily: T.mono, fontSize: 22, fontWeight: 600, color: "#f59e0b", lineHeight: 1 }}><Counter to={12} /></div>
                            <div style={{ fontSize: 10, color: "rgba(245,158,11,0.6)", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 2 }}>Day Streak</div>
                        </div>
                    </div>
                </motion.div>

                {/* ── TOP STAT STRIP ── */}
                <motion.div {...fadeUp(0.05)} style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
                    {[
                        { label: "Market Readiness", val: 72, suffix: "%", color: "#6366f1", icon: <TrendingUp size={16} />, sub: "Top 28% of candidates" },
                        { label: "Problems Solved", val: 143, suffix: "", color: "#10b981", icon: <Code2 size={16} />, sub: "+7 this week" },
                        { label: "Skills Mastered", val: 18, suffix: "", color: "#8b5cf6", icon: <Award size={16} />, sub: "+2 this month" },
                        { label: "Avg. Company Match", val: 88, suffix: "%", color: "#f59e0b", icon: <Target size={16} />, sub: "Gap: System Design" },
                    ].map((s, i) => (
                        <motion.div key={s.label} {...fadeUp(0.07 + i * 0.04)}
                            style={{ ...card(), padding: "18px 20px", position: "relative", overflow: "hidden" }}>
                            {/* top accent line */}
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${s.color},transparent)` }} />
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}22`, display: "grid", placeItems: "center", color: s.color }}>{s.icon}</div>
                            </div>
                            <div style={{ fontFamily: T.mono, fontSize: 28, fontWeight: 600, color: s.color, lineHeight: 1 }}>
                                <Counter to={s.val} suffix={s.suffix} delay={i * 80} />
                            </div>
                            <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{s.label}</div>
                            <div style={{ fontSize: 11, color: s.color, marginTop: 6, opacity: 0.8 }}>{s.sub}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* ── MAIN LAYOUT: LEFT + RIGHT ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

                    {/* ════ LEFT COLUMN ════ */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                        {/* DAILY FOCUS HERO */}
                        <motion.div {...fadeUp(0.1)}
                            style={{ background: "linear-gradient(135deg,#4f46e5 0%,#6366f1 60%,#7c3aed 100%)", border: "none", borderRadius: 22, padding: "26px 28px", position: "relative", overflow: "hidden" }}>
                            {/* glow orb */}
                            <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)", pointerEvents: "none" }} />

                            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", padding: "4px 11px", borderRadius: 20, marginBottom: 14 }}>
                                <Zap size={11} fill="currentColor" /> Daily Focus
                            </div>

                            <h2 style={{ fontSize: "1.7rem", fontWeight: 900, letterSpacing: "-0.025em", color: "#ffffff", margin: 0, marginBottom: 10, lineHeight: 1.2 }}>
                                Master System Design Basics
                            </h2>
                            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.65, marginBottom: 20, maxWidth: 520 }}>
                                Your mock interview data shows System Design is your biggest lever for MAANG readiness. Complete today's session to boost your Google match by 7%.
                            </p>

                            <div style={{ display: "flex", gap: 18, marginBottom: 22 }}>
                                {[
                                    { icon: <Clock size={12} />, text: "~45 min" },
                                    { icon: <BookOpen size={12} />, text: "Chapter 3 / 12" },
                                    { icon: <BarChart3 size={12} />, text: "Intermediate" },
                                ].map(m => (
                                    <div key={m.text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(248,250,252,0.35)" }}>
                                        {m.icon} {m.text}
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <button onClick={() => navigate("/interview")}
                                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#6366f1", color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: T.font, boxShadow: "0 8px 24px rgba(99,102,241,0.35)" }}>
                                    Start Session <ArrowRight size={15} />
                                </button>
                                <button style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.85)", borderRadius: 12, padding: "12px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: T.font }}>
                                    Save for later
                                </button>
                                <div style={{ marginLeft: "auto", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.22)", color: "#6ee7b7", fontSize: 12.5, fontWeight: 700, padding: "8px 14px", borderRadius: 10 }}>
                                    +7% Match Impact
                                </div>
                            </div>
                        </motion.div>

                        {/* SKILL MATRIX + COURSES — side by side */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

                            {/* SKILL MATRIX */}
                            <motion.div {...fadeUp(0.14)} style={card({ padding: "22px" })}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 700 }}>
                                        <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(99,102,241,0.15)", display: "grid", placeItems: "center" }}><TrendingUp size={14} color="#6366f1" /></div>
                                        Skill Matrix
                                    </div>
                                    <button onClick={() => navigate("/courses")} style={{ background: "none", border: "none", color: "#6366f1", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: T.font, display: "flex", alignItems: "center", gap: 3 }}>
                                        Improve <ChevronRight size={11} />
                                    </button>
                                </div>
                                {skills.map((s, i) => (
                                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < skills.length - 1 ? `1px solid ${T.border}` : "none" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, width: 116, flexShrink: 0 }}>
                                            <span style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>{s.name}</span>
                                            {s.focus && <span style={pill("rgba(244,63,94,0.15)", "#fb7185")}>Focus</span>}
                                        </div>
                                        <div style={{ flex: 1, height: 5, background: "rgba(0,0,0,0.07)", borderRadius: 5, overflow: "hidden" }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${s.level}%` }}
                                                transition={{ duration: 1.2, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                                                style={{ height: "100%", borderRadius: 5, background: s.color }} />
                                        </div>
                                        <span style={{ fontFamily: T.mono, fontSize: 11.5, fontWeight: 500, color: s.color, width: 32, textAlign: "right", flexShrink: 0 }}>{s.level}%</span>
                                    </div>
                                ))}
                            </motion.div>

                            {/* RECOMMENDED COURSES */}
                            <motion.div {...fadeUp(0.17)} style={card({ padding: "22px" })}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 700 }}>
                                        <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(16,185,129,0.15)", display: "grid", placeItems: "center" }}><BookOpen size={14} color="#10b981" /></div>
                                        Recommended
                                    </div>
                                    <button style={{ background: "none", border: "none", color: "#6366f1", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: T.font, display: "flex", alignItems: "center", gap: 3 }}>
                                        All <ChevronRight size={11} />
                                    </button>
                                </div>
                                {courses.map((c, i) => (
                                    <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < courses.length - 1 ? `1px solid ${T.border}` : "none" }}>
                                        <div style={{ width: 42, height: 42, borderRadius: 10, background: c.bg, display: "grid", placeItems: "center", fontSize: 18, flexShrink: 0 }}>{c.emoji}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 12.5, fontWeight: 600, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                                            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{c.meta}</div>
                                            <div style={{ marginTop: 3 }}><Stars n={c.stars} /></div>
                                        </div>
                                        <button style={{ background: "rgba(99,102,241,0.15)", border: "none", borderRadius: 8, padding: "6px 10px", color: "#a5b4fc", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: T.font, display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                                            <Play size={10} /> Start
                                        </button>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* CAREER ROADMAPS */}
                        <motion.div {...fadeUp(0.2)} style={card({ padding: "22px" })}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 700 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(139,92,246,0.15)", display: "grid", placeItems: "center" }}><Rocket size={14} color="#8b5cf6" /></div>
                                    Career Roadmaps
                                </div>
                                <button style={{ background: "none", border: "none", color: "#6366f1", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: T.font, display: "flex", alignItems: "center", gap: 3 }}>
                                    Explore all <ChevronRight size={11} />
                                </button>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                {roadmaps.map((r, i) => (
                                    <div key={r.name}
                                        style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, opacity: r.locked ? 0.45 : 1, cursor: r.locked ? "not-allowed" : "pointer", transition: "border-color 0.2s" }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: r.bg, display: "grid", placeItems: "center", color: r.color, flexShrink: 0 }}>{r.icon}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 12.5, fontWeight: 700, color: T.text }}>{r.name}</div>
                                            <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>{r.sub}</div>
                                            {!r.locked && (
                                                <div style={{ marginTop: 8, height: 3, background: "rgba(0,0,0,0.07)", borderRadius: 3, overflow: "hidden" }}>
                                                    <motion.div style={{ height: "100%", background: r.color, borderRadius: 3 }}
                                                        initial={{ width: 0 }} animate={{ width: `${r.prog}%` }}
                                                        transition={{ duration: 1.2, delay: 0.4 + i * 0.1 }} />
                                                </div>
                                            )}
                                        </div>
                                        {r.locked
                                            ? <Lock size={13} color={T.muted} style={{ flexShrink: 0 }} />
                                            : <span style={{ fontFamily: T.mono, fontSize: 11.5, fontWeight: 500, color: r.color, flexShrink: 0 }}>{r.prog}%</span>
                                        }
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* RECENT ACTIVITY */}
                        <motion.div {...fadeUp(0.24)} style={card({ padding: "22px" })}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 700, marginBottom: 16 }}>
                                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(245,158,11,0.15)", display: "grid", placeItems: "center" }}><Activity size={14} color="#f59e0b" /></div>
                                Recent Activity
                            </div>
                            {activity.map((a, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < activity.length - 1 ? `1px solid ${T.border}` : "none" }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 9, background: a.bg, display: "grid", placeItems: "center", color: a.color, flexShrink: 0 }}>{a.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{a.text}</div>
                                        <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{a.time}</div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                    </div>{/* end LEFT */}

                    {/* ════ RIGHT COLUMN ════ */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* READINESS RING */}
                        <motion.div {...fadeUp(0.12)}
                            style={{ ...card(), background: "linear-gradient(160deg,#f5f3ff 0%,#ede9fe 100%)", border: "1px solid rgba(99,102,241,0.15)", padding: "22px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 700 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(99,102,241,0.18)", display: "grid", placeItems: "center" }}><Target size={14} color="#818cf8" /></div>
                                    Market Readiness
                                </div>
                                <span style={pill("rgba(16,185,129,0.15)", "#6ee7b7")}>Top 28%</span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                                <div style={{ position: "relative", flexShrink: 0 }}>
                                    <Ring pct={72} size={96} strokeW={8} color="#6366f1" />
                                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                        <span style={{ fontFamily: T.mono, fontSize: 18, fontWeight: 600, color: "#4f46e5", lineHeight: 1 }}>72%</span>
                                        <span style={{ fontSize: 8.5, color: T.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 2 }}>Overall</span>
                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    {subDomains.map(s => (
                                        <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                            <span style={{ fontSize: 11.5, color: T.muted }}>{s.label}</span>
                                            <span style={{ fontFamily: T.mono, fontSize: 11.5, fontWeight: 500, color: s.color }}>{s.pct}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {subDomains.map((s, i) => (
                                <div key={s.label} style={{ marginTop: i === 0 ? 0 : 7, height: 4, background: "rgba(0,0,0,0.07)", borderRadius: 4, overflow: "hidden" }}>
                                    <motion.div style={{ height: "100%", background: s.color, borderRadius: 4 }}
                                        initial={{ width: 0 }} animate={{ width: `${s.pct}%` }}
                                        transition={{ duration: 1.2, delay: 0.35 + i * 0.08, ease: [0.16, 1, 0.3, 1] }} />
                                </div>
                            ))}
                        </motion.div>

                        {/* DREAM COMPANIES */}
                        <motion.div {...fadeUp(0.16)} style={card({ padding: "22px" })}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 700 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(244,63,94,0.15)", display: "grid", placeItems: "center" }}><Target size={14} color="#f43f5e" /></div>
                                    Dream Companies
                                </div>
                                <button onClick={() => navigate("/resume")} style={{ background: "none", border: "none", color: "#6366f1", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: T.font, display: "flex", alignItems: "center", gap: 3 }}>
                                    Analysis <ChevronRight size={11} />
                                </button>
                            </div>
                            {companies.map((c, i) => (
                                <div key={c.name}
                                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 13px", background: T.card2, border: `1px solid ${T.border}`, borderRadius: 13, marginBottom: i < companies.length - 1 ? 9 : 0, cursor: "pointer" }}>
                                    <div style={{ width: 38, height: 38, borderRadius: 10, background: c.bg, display: "grid", placeItems: "center", color: "#fff", fontWeight: 900, fontSize: 15, flexShrink: 0 }}>{c.letter}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{c.name}</span>
                                            <span style={pill(c.tier === "high" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", c.tier === "high" ? "#6ee7b7" : "#fcd34d")}>{c.match}%</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                                            <AlertCircle size={10} color="#f59e0b" />
                                            <span style={{ fontSize: 11, color: T.muted }}>Gap: {c.gap}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button onClick={() => navigate("/resume")}
                                style={{ width: "100%", marginTop: 12, padding: "11px", borderRadius: 11, border: `1px solid ${T.border2}`, background: "transparent", color: T.muted, fontWeight: 600, fontSize: 12.5, cursor: "pointer", fontFamily: T.font, transition: "all 0.2s" }}>
                                View Detailed Analysis →
                            </button>
                        </motion.div>

                        {/* WEEKLY GOALS */}
                        <motion.div {...fadeUp(0.2)} style={card({ padding: "22px" })}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 700 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(245,158,11,0.15)", display: "grid", placeItems: "center" }}><Trophy size={14} color="#f59e0b" /></div>
                                    Weekly Goals
                                </div>
                                <span style={{ fontFamily: T.mono, fontSize: 12, color: T.muted }}>{doneCount}/{goals.length}</span>
                            </div>
                            {/* progress track */}
                            <div style={{ height: 3, background: "rgba(0,0,0,0.07)", borderRadius: 3, overflow: "hidden", marginBottom: 14 }}>
                                <motion.div style={{ height: "100%", background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: 3 }}
                                    animate={{ width: `${(doneCount / goals.length) * 100}%` }}
                                    transition={{ duration: 0.5 }} />
                            </div>
                            {goals.map((g, i) => (
                                <div key={i} onClick={() => toggle(i)}
                                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", cursor: "pointer" }}>
                                    <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: g.done ? "none" : "1.5px solid #cbd5e1", background: g.done ? "#6366f1" : "transparent", display: "grid", placeItems: "center", transition: "all 0.2s" }}>
                                        {g.done && <CheckCircle2 size={12} color="#fff" />}
                                    </div>
                                    <span style={{ fontSize: 12.5, color: g.done ? T.muted : T.text, fontWeight: g.done ? 400 : 500, textDecoration: g.done ? "line-through" : "none", transition: "all 0.2s" }}>{g.text}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* AI INSIGHT */}
                        <motion.div {...fadeUp(0.24)}
                            style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 16, padding: "16px 18px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                                <Sparkles size={14} color="#a78bfa" />
                                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#a78bfa", textTransform: "uppercase", letterSpacing: "0.07em" }}>AI Insight</span>
                            </div>
                            <p style={{ fontSize: 12.5, color: "#c4b5fd", lineHeight: 1.65, margin: 0 }}>
                                Students who improve System Design to 70%+ see an average <strong style={{ color: "#ddd6fe" }}>+18% jump</strong> in MAANG match scores. At your current pace, you're ~3 weeks away — keep it up!
                            </p>
                        </motion.div>

                    </div>{/* end RIGHT */}
                </div>{/* end main grid */}
            </div>

            {/* ── responsive overrides via injected style ── */}
            <style>{`
        @media (max-width: 1024px) {
          .gh-main-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 720px) {
          .gh-stat-strip { grid-template-columns: 1fr 1fr !important; }
          .gh-mid-grid   { grid-template-columns: 1fr !important; }
          .gh-road-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
};

export default Dashboard;
