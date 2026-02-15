import React from "react";
import { motion } from "framer-motion";

const RoadmapVisualizer = ({ roadmap }) => {
    if (!roadmap?.weeks) return null;

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <motion.h1
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={styles.header}
            >
                🧭 Your Learning Journey
            </motion.h1>

            {/* TIMELINE */}
            <div style={styles.timeline}>
                {roadmap.weeks.map((week, index) => {
                    const isLeft = index % 2 === 0;

                    return (
                        <div key={index} style={styles.row} className="roadmap-row-mobile">
                            {/* LEFT SIDE */}
                            <div style={styles.side} className="roadmap-side-left-mobile">
                                {isLeft && <GlassCard week={week} index={index} />}
                            </div>

                            {/* CENTER */}
                            <div style={styles.center} className="roadmap-center-mobile">
                                <div style={styles.line} className="roadmap-line-mobile" />
                                <div style={styles.dot} />
                            </div>

                            {/* RIGHT SIDE */}
                            <div style={styles.side} className="roadmap-side-right-mobile">
                                {!isLeft ? <GlassCard week={week} index={index} /> : <div className="mobile-show"><GlassCard week={week} index={index} /></div>}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* FOOTER */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={styles.footer}
            >
                🎉 Mission Complete
            </motion.div>
        </div>
    );
};

/* ==========================
   GLASS CARD
========================== */
const GlassCard = ({ week, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        style={styles.card}
        className="roadmap-card-mobile"
    >
        <div style={styles.week}>WEEK {index + 1}</div>
        <h3 style={styles.title}>{week.title}</h3>
        <p style={styles.focus}>{week.focus}</p>

        <div style={styles.topics}>
            {week.topics?.map((t, i) => (
                <span key={i} style={styles.topic}>{t}</span>
            ))}
        </div>

        <div style={styles.project}>🏆 {week.project}</div>
    </motion.div>
);

/* ==========================
   STYLES – COMPACT WHITE APPLE GLASS
========================== */
const styles = {
    page: {
        minHeight: "100vh",
        padding: "60px 16px",
        background: "#ffffff",
        fontFamily: "-apple-system, BlinkMacSystemFont, system-ui",
    },

    header: {
        textAlign: "center",
        fontSize: "2rem",
        fontWeight: 800,
        color: "#0f172a",
        marginBottom: "48px",
    },

    timeline: {
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "48px",
    },

    row: {
        display: "grid",
        gridTemplateColumns: "1fr 50px 1fr",
        alignItems: "center",
    },

    side: {
        display: "flex",
        justifyContent: "center",
    },

    center: {
        position: "relative",
        display: "flex",
        justifyContent: "center",
    },

    line: {
        position: "absolute",
        width: "2px",
        height: "120px",
        top: "-60px",
        background: "linear-gradient(#cbd5e1, transparent)",
    },

    dot: {
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        background: "#0f172a",
    },

    /* LIGHT GLASS CARD */
    card: {
        width: "100%",
        maxWidth: "400px",
        padding: "20px",
        borderRadius: "18px",

        background:
            "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.75))",
        backdropFilter: "blur(18px) saturate(160%)",
        WebkitBackdropFilter: "blur(18px) saturate(160%)",

        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow:
            "0 16px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",

        color: "#0f172a",
    },

    week: {
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "1px",
        color: "#2563eb",
        marginBottom: "4px",
    },

    title: {
        fontSize: "1.25rem",
        fontWeight: 800,
        marginBottom: "8px",
    },

    focus: {
        fontSize: "0.9rem",
        color: "#334155",
        lineHeight: 1.6,
        marginBottom: "12px",
    },

    topics: {
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        marginBottom: "12px",
    },

    topic: {
        fontSize: "0.72rem",
        padding: "6px 12px",
        borderRadius: "999px",
        background: "rgba(0,0,0,0.05)",
        border: "1px solid rgba(0,0,0,0.08)",
        fontWeight: 600,
    },

    project: {
        padding: "12px",
        borderRadius: "12px",
        background: "rgba(37,99,235,0.08)",
        border: "1px solid rgba(37,99,235,0.2)",
        color: "#1e3a8a",
        fontWeight: 700,
        fontSize: "0.85rem",
    },

    footer: {
        marginTop: "64px",
        textAlign: "center",
        fontSize: "1.4rem",
        fontWeight: 800,
        color: "#0f172a",
    },
};

// Injecting mobile styles for RoadmapVisualizer
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @media (max-width: 768px) {
            .roadmap-row-mobile {
                grid-template-columns: 40px 1fr !important;
                gap: 16px !important;
            }
            .roadmap-side-left-mobile {
                display: none !important;
            }
            .roadmap-side-right-mobile {
                justify-content: flex-start !important;
                grid-column: 2 !important;
            }
            .roadmap-center-mobile {
                grid-column: 1 !important;
            }
            .roadmap-line-mobile {
                left: 19px !important;
                height: 150px !important;
                top: -75px !important;
            }
            .roadmap-card-mobile {
                max-width: 100% !important;
            }
        }
    `;
    document.head.appendChild(styleSheet);
}

export default RoadmapVisualizer;
