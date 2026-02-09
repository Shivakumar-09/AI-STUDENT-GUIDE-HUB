import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Trophy } from 'lucide-react';

const Opportunities = () => {
    const [type, setType] = useState('internships');

    const trends = [
        { label: "High Demand", skill: "Distributed Systems", growth: "+42%" },
        { label: "Rising", skill: "MLOps", growth: "+18%" },
        { label: "Critical", skill: "System Design", growth: "Top Priority" }
    ];

    const [internships, setInternships] = useState([]);
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Internships
                const internRes = await fetch('http://localhost:8000/api/live-internships');
                const internData = await internRes.json();

                // Map API data to component format
                const formattedInternships = internData.map(item => ({
                    title: item.title,
                    company: item.company,
                    logo: item.company.charAt(0),
                    color: `hsl(${Math.random() * 360}, 70%, 50%)`, // Random color for now
                    location: item.location,
                    stipend: item.stipend,
                    match: Math.floor(Math.random() * 20) + 80, // Random match score 80-99
                    tags: [item.track],
                    apply_url: item.apply_url
                }));
                setInternships(formattedInternships);

                // Fetch Hackathons
                const hackRes = await fetch('http://localhost:8000/api/live-hackathons');
                const hackData = await hackRes.json();

                // Map API data to component format
                const formattedHackathons = hackData.map(item => ({
                    title: item.title,
                    company: "Event",
                    logo: "E",
                    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
                    description: item.description,
                    match: 95,
                    tags: [item.mode, item.perks],
                    apply_url: item.url
                }));
                setHackathons(formattedHackathons);

            } catch (err) {
                console.error("Failed to fetch opportunities:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper to get random color if needed, or use consistent ones based on company name hash

    return (
        <div className="opportunities-hub" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* MARKET INTELLIGENCE DASHBOARD */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05), transparent)' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Market Intelligence Hub</h2>
                    <span className="badge badge-trust">Real-time Pulse</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    {trends.map((t, i) => (
                        <div key={i} style={{ padding: '16px', borderRadius: '16px', background: '#fff', border: '1px solid var(--border-subtle)' }}>
                            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{t.label}</div>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '4px' }}>{t.skill}</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--progress)' }}>{t.growth}</div>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* CAREER UPDATES BANNER */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    background: 'linear-gradient(90deg, #0ea5e9, #6366f1)',
                    borderRadius: '20px',
                    padding: '24px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#fff',
                    boxShadow: '0 10px 25px rgba(14, 165, 233, 0.25)'
                }}
            >
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', opacity: 0.9 }}>Career Catalyst Partner</div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '4px' }}>Powered by Goyal Arsh</h3>
                    <p style={{ opacity: 0.95, fontSize: '0.9rem', maxWidth: '450px' }}>
                        Get daily updates on exclusive internships, off-campus drives, and hackathons directly from the source.
                    </p>
                </div>
                <button
                    onClick={() => window.open('https://web.telegram.org/k/#@goyalarsh', '_blank')}
                    style={{
                        background: '#fff',
                        color: '#0ea5e9',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                >
                    JOIN UPDATES CHANNEL 🚀
                </button>
            </motion.div >

            {/* SEGMENTED NAVIGATION */}
            < div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="tabs">
                    <button
                        className={`seg-btn ${type === 'internships' ? 'active' : ''}`}
                        onClick={() => setType('internships')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Briefcase size={16} /> Engineering Internships
                    </button>
                    <button
                        className={`seg-btn ${type === 'hackathons' ? 'active' : ''}`}
                        onClick={() => setType('hackathons')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Trophy size={16} /> Innovation & Hackathons
                    </button>
                </div>
            </div >

            {/* OPPORTUNITY GRID */}
            < AnimatePresence mode="wait" >
                <motion.div
                    key={type}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="grid grid-2"
                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}
                >
                    {loading ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>Loading opportunities...</div>
                    ) : (type === 'internships' ? internships : hackathons).map((item, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="card"
                            style={{
                                padding: '24px',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                cursor: 'pointer'
                            }}
                            onClick={() => window.open(item.apply_url, '_blank')}
                        >
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: item.color }}></div>

                            <div>
                                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                    <div style={{
                                        width: '56px', height: '56px', borderRadius: '14px', background: '#f8fafc', border: '1px solid var(--border-subtle)',
                                        display: 'grid', placeItems: 'center', fontSize: '1.5rem', fontWeight: 900, color: item.color,
                                        flexShrink: 0
                                    }}>
                                        {item.logo}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h4>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{item.company}</div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>Match</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: item.match > 80 ? 'var(--progress)' : 'var(--warning)' }}>{item.match}%</div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '24px', minHeight: '60px' }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '12px' }}>
                                        {type === 'internships' ? `📍 ${item.location} • 💰 ${item.stipend}` : item.description}
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {item.tags.map(tag => (
                                            <span key={tag} style={{ padding: '4px 10px', borderRadius: '99px', background: '#f1f5f9', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)' }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px dashed var(--border-subtle)' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                                    {type === 'internships' ? 'Full Cycle' : 'Premium'}
                                </span>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn"
                                    style={{ padding: '8px 20px', borderRadius: '10px', background: 'var(--accent)', fontWeight: 800, border: 'none', color: '#fff' }}
                                >
                                    Apply Now
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence >
        </div >
    );
};

export default Opportunities;
