import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RoadmapVisualizer from './RoadmapVisualizer';

/* -------------------- AI THINKING STEPS -------------------- */

const THINKING_STEPS = [
    'Analyzing skill requirements…',
    'Mapping industry expectations…',
    'Structuring learning phases…',
    'Optimizing for career growth…',
    'Finalizing roadmap…'
];

/* -------------------- UNIQUE ROADMAP DEFINITIONS -------------------- */

const ROADMAP_DEFINITIONS = {
    python_fullstack: {
        title: 'Python Full Stack Development',
        summary:
            'A complete <strong>Python Full Stack</strong> roadmap covering frontend, backend, databases, and deployment.',
        weeks: [
            {
                title: 'Python Core',
                focus: 'Strong programming foundations.',
                topics: ['Syntax', 'OOP', 'Virtual Envs', 'Memory'],
                project: 'CLI Task Manager',
                status: 'completed',
                time: '15h',
                difficulty: 'Beginner',
                resources: [
                    { title: 'Real Python', url: 'https://realpython.com/' },
                    { title: 'Python Docs', url: 'https://docs.python.org/3/' }
                ]
            },
            {
                title: 'DSA with Python',
                focus: 'Problem-solving and logic building.',
                topics: ['Arrays', 'Stacks', 'Trees', 'Graphs'],
                project: 'Algorithm Visualizer',
                status: 'completed',
                time: '20h',
                difficulty: 'Intermediate',
                resources: [
                    { title: 'LeetCode', url: 'https://leetcode.com/' },
                    { title: 'NeetCode.io', url: 'https://neetcode.io/' }
                ]
            },
            {
                title: 'Frontend Development',
                focus: 'User-facing applications.',
                topics: ['HTML', 'CSS', 'React', 'State'],
                project: 'Dashboard UI',
                status: 'in-progress',
                time: '18h',
                difficulty: 'Intermediate',
                resources: [
                    { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
                    { title: 'React.dev', url: 'https://react.dev/' }
                ]
            },
            {
                title: 'Backend Development',
                focus: 'Scalable backend systems.',
                topics: ['FastAPI', 'JWT', 'WebSockets'],
                project: 'REST API',
                status: 'pending',
                time: '25h',
                difficulty: 'Advanced',
                resources: [
                    { title: 'FastAPI Docs', url: 'https://fastapi.tiangolo.com/' },
                    { title: 'Full Stack Python', url: 'https://www.fullstackpython.com/' }
                ]
            },
            {
                title: 'Databases',
                focus: 'Data storage and caching.',
                topics: ['PostgreSQL', 'ORM', 'Redis'],
                project: 'Data Service',
                status: 'pending',
                time: '12h',
                difficulty: 'Intermediate',
                resources: [
                    { title: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/' },
                    { title: 'Redis Docs', url: 'https://redis.io/docs/' }
                ]
            },
            {
                title: 'Deployment',
                focus: 'Production readiness.',
                topics: ['Docker', 'CI/CD', 'AWS'],
                project: 'Deployed Application',
                status: 'pending',
                time: '10h',
                difficulty: 'Advanced',
                resources: [
                    { title: 'Docker Get Started', url: 'https://docs.docker.com/get-started/' },
                    { title: 'AWS Free Tier', url: 'https://aws.amazon.com/free/' }
                ]
            }
        ]
    },

    react_frontend: {
        title: 'React Frontend Engineering',
        summary:
            'A modern <strong>frontend engineering</strong> roadmap focused on React and UI scalability.',
        weeks: [
            {
                title: 'HTML & CSS',
                focus: 'Web fundamentals.',
                topics: ['Flexbox', 'Grid', 'Responsive Design'],
                project: 'Landing Page',
                status: 'completed',
                time: '10h',
                difficulty: 'Beginner',
                resources: [
                    { title: 'CSS Tricks', url: 'https://css-tricks.com/' },
                    { title: 'MDN', url: 'https://developer.mozilla.org/' }
                ]
            },
            {
                title: 'JavaScript Mastery',
                focus: 'Core JS concepts.',
                topics: ['Closures', 'Promises', 'Async/Await'],
                project: 'JS Utilities',
                status: 'completed',
                time: '20h',
                difficulty: 'Intermediate',
                resources: [
                    { title: 'JavaScript.info', url: 'https://javascript.info/' },
                    { title: 'You Don\'t Know JS', url: 'https://github.com/getify/You-Dont-Know-JS' }
                ]
            },
            {
                title: 'React Core',
                focus: 'Component-based UI.',
                topics: ['Hooks', 'Props', 'State'],
                project: 'SPA App',
                status: 'in-progress',
                time: '25h',
                difficulty: 'Intermediate',
                resources: [
                    { title: 'React Learn', url: 'https://react.dev/learn' },
                    { title: 'Overreacted', url: 'https://overreacted.io/' }
                ]
            },
            {
                title: 'Advanced React',
                focus: 'Production-grade UI.',
                topics: ['Performance', 'Testing', 'Patterns'],
                project: 'Production Dashboard',
                status: 'pending',
                time: '30h',
                difficulty: 'Advanced',
                resources: [
                    { title: 'Kent C. Dodds', url: 'https://kentcdodds.com/' },
                    { title: 'React Patterns', url: 'https://reactpatterns.com/' }
                ]
            }
        ]
    },

    ai_engineer: {
        title: 'AI / Machine Learning Engineer',
        summary:
            'From <strong>ML foundations</strong> to <strong>Generative AI systems</strong>.',
        weeks: [
            {
                title: 'Math Foundations',
                focus: 'Core ML math.',
                topics: ['Linear Algebra', 'Probability'],
                project: 'Math Notebook',
                status: 'completed',
                time: '20h',
                difficulty: 'Hard',
                resources: [
                    { title: 'Khan Academy', url: 'https://www.khanacademy.org/math' },
                    { title: '3Blue1Brown', url: 'https://www.3blue1brown.com/' }
                ]
            },
            {
                title: 'Machine Learning',
                focus: 'Classical ML.',
                topics: ['Regression', 'Classification', 'Clustering'],
                project: 'ML Models',
                status: 'completed',
                time: '30h',
                difficulty: 'Advanced',
                resources: [
                    { title: 'Andrew Ng Course', url: 'https://www.coursera.org/learn/machine-learning' },
                    { title: 'Scikit-Learn', url: 'https://scikit-learn.org/' }
                ]
            },
            {
                title: 'Deep Learning',
                focus: 'Neural networks.',
                topics: ['CNN', 'RNN', 'Transformers'],
                project: 'Neural Network',
                status: 'in-progress',
                time: '40h',
                difficulty: 'Advanced',
                resources: [
                    { title: 'Fast.ai', url: 'https://www.fast.ai/' },
                    { title: 'PyTorch', url: 'https://pytorch.org/' }
                ]
            },
            {
                title: 'Generative AI',
                focus: 'LLMs and agents.',
                topics: ['RAG', 'Prompt Engineering', 'Agents'],
                project: 'AI Chatbot',
                status: 'pending',
                time: '25h',
                difficulty: 'Intermediate',
                resources: [
                    { title: 'LangChain', url: 'https://python.langchain.com/' },
                    { title: 'DeepLearning.AI', url: 'https://www.deeplearning.ai/' }
                ]
            }
        ]
    },

    data_engineer: {
        title: 'Data Engineering',
        summary: 'Build scalable <strong>data pipelines</strong> and analytics infrastructure.',
        weeks: [
            {
                title: 'SQL & Data Basics',
                focus: 'Strong database foundations.',
                topics: ['SQL', 'Normalization', 'Indexing'],
                project: 'Analytics DB Setup',
                status: 'completed',
                time: '15h',
                difficulty: 'Beginner'
            },
            {
                title: 'Python for Data',
                focus: 'Data processing.',
                topics: ['Pandas', 'NumPy', 'Data Cleaning'],
                project: 'Data Cleaning Pipeline',
                status: 'in-progress',
                time: '20h',
                difficulty: 'Intermediate'
            },
            {
                title: 'Big Data Tools',
                focus: 'Distributed systems.',
                topics: ['Spark', 'Hadoop', 'ETL'],
                project: 'Mini ETL System',
                status: 'pending',
                time: '30h',
                difficulty: 'Advanced'
            }
        ]
    },

    blockchain_dev: {
        title: 'Blockchain Developer',
        summary: 'Master <strong>Web3</strong>, smart contracts, and decentralized apps.',
        weeks: [
            {
                title: 'Blockchain Basics',
                focus: 'Core fundamentals.',
                topics: ['Cryptography', 'Bitcoin', 'Ethereum'],
                project: 'Blockchain Demo',
                status: 'completed'
            },
            {
                title: 'Solidity',
                focus: 'Smart contract development.',
                topics: ['Solidity', 'Remix', 'MetaMask'],
                project: 'Token Contract',
                status: 'in-progress'
            },
            {
                title: 'DApp Development',
                focus: 'Frontend + Smart Contracts.',
                topics: ['Web3.js', 'Wallet Integration'],
                project: 'Mini NFT DApp',
                status: 'pending'
            }
        ]
    },

    mobile_dev: {
        title: 'Mobile App Development',
        summary: 'Build cross-platform <strong>mobile apps</strong> with modern frameworks.',
        weeks: [
            {
                title: 'Dart / JavaScript Basics',
                focus: 'Language foundations.',
                topics: ['Dart Basics', 'ES6'],
                project: 'Basic App UI',
                status: 'completed'
            },
            {
                title: 'Flutter / React Native',
                focus: 'App Development.',
                topics: ['State Management', 'Navigation'],
                project: 'Todo Mobile App',
                status: 'in-progress'
            },
            {
                title: 'API Integration',
                focus: 'Connect backend services.',
                topics: ['REST', 'Firebase'],
                project: 'Chat App',
                status: 'pending'
            }
        ]
    },

    game_dev: {
        title: 'Game Development (Unity)',
        summary: 'Create interactive <strong>2D/3D games</strong>.',
        weeks: [
            {
                title: 'C# Basics',
                focus: 'Game scripting.',
                topics: ['OOP', 'Game Loops'],
                project: 'Mini 2D Game',
                status: 'completed'
            },
            {
                title: 'Unity Engine',
                focus: 'Scene & Physics.',
                topics: ['RigidBody', 'Colliders'],
                project: 'Platformer Game',
                status: 'in-progress'
            },
            {
                title: 'Advanced Gameplay',
                focus: 'AI & Multiplayer.',
                topics: ['Pathfinding', 'Photon'],
                project: 'Multiplayer Game',
                status: 'pending'
            }
        ]
    },

    data_analyst: {
        title: 'Data Analyst',
        summary: 'Master <strong>data visualization</strong> and business insights.',
        weeks: [
            {
                title: 'Excel & SQL',
                focus: 'Data querying.',
                topics: ['Pivot Tables', 'Joins'],
                project: 'Sales Dashboard',
                status: 'completed'
            },
            {
                title: 'Python for Analysis',
                focus: 'Data exploration.',
                topics: ['Pandas', 'Matplotlib'],
                project: 'Trend Analysis',
                status: 'in-progress'
            },
            {
                title: 'Power BI / Tableau',
                focus: 'Visualization.',
                topics: ['Dashboards', 'Storytelling'],
                project: 'Business Insights Report',
                status: 'pending'
            }
        ]
    },

    sde_product_based: {
        title: 'SDE (Product-Based Company Preparation)',
        summary: 'Prepare for <strong>FAANG & top product-based companies</strong>.',
        weeks: [
            {
                title: 'Advanced DSA',
                focus: 'Coding interviews.',
                topics: ['DP', 'Graphs', 'Backtracking'],
                project: 'Solve 300 LeetCode',
                status: 'in-progress'
            },
            {
                title: 'System Design',
                focus: 'Scalable architecture.',
                topics: ['Load Balancers', 'Caching'],
                project: 'Design Twitter',
                status: 'pending'
            },
            {
                title: 'Core CS',
                focus: 'Interview theory.',
                topics: ['OS', 'DBMS', 'Networking'],
                project: 'Mock Interviews',
                status: 'pending'
            }
        ]
    }
};

/* -------------------- INDUSTRY STANDARD COURSES -------------------- */
const INDUSTRY_COURSES = [
    {
        title: "AI Engineer 2026: Gen AI, Deep Learning & LLMs",
        provider: "Udemy",
        category: "Artificial Intelligence"
    },
    {
        title: "Data Engineering",
        provider: "Industry Choice",
        category: "Data Engineering"
    },
    {
        title: "Blockchain Developer",
        provider: "Web3 Standard",
        category: "Blockchain"
    },
    {
        title: "Mobile App Development",
        provider: "Cross-Platform",
        category: "Mobile"
    },
    {
        title: "Game Development (Unity)",
        provider: "Gaming Standard",
        category: "Game Dev"
    },
    {
        title: "Data Analyst",
        provider: "Business Intelligence",
        category: "Analytics"
    },
    {
        title: "SDE (Product-Based Company Preparation)",
        provider: "FAANG Prep",
        category: "Career"
    },
    {
        title: "Data Structures & Algorithms: Developer’s Guide",
        provider: "Coursevania",
        category: "Computer Science"
    },
    {
        title: "Full-Stack AI Engineer Bootcamp",
        provider: "Udemy",
        category: "Web Engineering"
    },
    {
        title: "AI & Cyber Security Mastery 2025",
        provider: "Udemy",
        category: "Cybersecurity"
    }
];

/* -------------------- ROADMAP DETECTION -------------------- */

const detectRoadmap = (track) => {
    const t = track.toLowerCase();

    if (t.includes('python') && t.includes('full')) {
        return ROADMAP_DEFINITIONS.python_fullstack;
    }

    if (t.includes('react') || t.includes('frontend')) {
        return ROADMAP_DEFINITIONS.react_frontend;
    }

    if (t.includes('ai') || t.includes('ml') || t.includes('intelligence') || t.includes('llama')) {
        return ROADMAP_DEFINITIONS.ai_engineer;
    }

    if (t.includes('data') && t.includes('engineer')) {
        return ROADMAP_DEFINITIONS.data_engineer;
    }

    if (t.includes('blockchain') || t.includes('web3') || t.includes('crypto')) {
        return ROADMAP_DEFINITIONS.blockchain_dev;
    }

    if (t.includes('mobile') || t.includes('flutter') || t.includes('android') || t.includes('ios')) {
        return ROADMAP_DEFINITIONS.mobile_dev;
    }

    if (t.includes('game') || t.includes('unity') || t.includes('unreal')) {
        return ROADMAP_DEFINITIONS.game_dev;
    }

    if (t.includes('analyst') || t.includes('analytics') || t.includes('visualization')) {
        return ROADMAP_DEFINITIONS.data_analyst;
    }

    if (t.includes('sde') || t.includes('faang') || t.includes('product') || t.includes('interview')) {
        return ROADMAP_DEFINITIONS.sde_product_based;
    }

    if (t.includes('cloud') || t.includes('aws') || t.includes('azure') || t.includes('google cloud')) {
        return {
            title: 'Cloud Engineering Path',
            summary: 'Master <strong>Cloud Infrastructure</strong>, scaling, and architectural patterns.',
            weeks: [
                { title: 'Cloud Foundations', focus: 'Core cloud concepts.', topics: ['IaaS/PaaS', 'Networking', 'IAM'], project: 'Cloud Budget setup', status: 'completed' },
                { title: 'Serverless & Compute', focus: 'Building scalable logic.', topics: ['Lambda/Functions', 'EC2/VMs'], project: 'Static Web Hosting', status: 'pending' },
                { title: 'Cloud Architecture', focus: 'High availability systems.', topics: ['Load Balancers', 'Auto-scaling', 'DBs'], project: 'Multi-region App', status: 'pending' }
            ]
        };
    }

    if (t.includes('devops') || t.includes('kubernetes') || t.includes('docker') || t.includes('jenkins')) {
        return {
            title: 'DevOps & SRE Roadmap',
            summary: 'Automate <strong>pipelines</strong> and manage <strong>containerized</strong> environments.',
            weeks: [
                { title: 'CI/CD Foundations', focus: 'Automation pipelines.', topics: ['Git', 'Jenkins', 'GitHub Actions'], project: 'Automated Build', status: 'completed' },
                { title: 'Containerization', focus: 'Packaging applications.', topics: ['Docker', 'Images', 'Volumes'], project: 'Microservice Container', status: 'pending' },
                { title: 'Orchestration', focus: 'Scaling containers.', topics: ['Kubernetes', 'Helm', 'Pods'], project: 'K8s Deployment', status: 'pending' }
            ]
        };
    }

    if (t.includes('cyber') || t.includes('security') || t.includes('hacking')) {
        return {
            title: 'Cybersecurity Specialist',
            summary: 'Protect <strong>systems</strong> and <strong>networks</strong> from modern threats.',
            weeks: [
                { title: 'Security Basics', focus: 'Network security.', topics: ['TCP/IP', 'Firewalls', 'VPNs'], project: 'Secure Home Net', status: 'completed' },
                { title: 'Vulnerability Analysis', focus: 'Finding flaws.', topics: ['Pen Testing', 'OWASP Top 10'], project: 'App Audit', status: 'pending' },
                { title: 'Incident Response', focus: 'Handling breaches.', topics: ['Forensics', 'Recovery', 'SIEM'], project: 'Response Plan', status: 'pending' }
            ]
        };
    }

    return {
        title: track,
        summary: `A structured roadmap to master <strong>${track}</strong> from fundamentals to production.`,
        weeks: [
            {
                title: 'Phase 1: Foundations',
                focus: 'Core concepts and syntax.',
                topics: ['Basics', 'Internal structures', 'Tooling'],
                project: 'Starter Project',
                status: 'completed'
            },
            {
                title: 'Phase 2: Mastery',
                focus: 'Architecture and optimization.',
                topics: ['Advanced Patterns', 'Performance', 'Scale'],
                project: 'Production-ready System',
                status: 'pending'
            }
        ]
    };
};

/* -------------------- MAIN COMPONENT -------------------- */

const Roadmap = () => {
    const [loading, setLoading] = useState(false);
    const [roadmap, setRoadmap] = useState(null);
    const [track, setTrack] = useState('');
    const [thinkingStep, setThinkingStep] = useState(0);

    useEffect(() => {
        if (!loading) return;

        setThinkingStep(0);
        const interval = setInterval(() => {
            setThinkingStep((prev) =>
                prev < THINKING_STEPS.length - 1 ? prev + 1 : prev
            );
        }, 400);

        return () => clearInterval(interval);
    }, [loading]);

    const generateRoadmap = () => {
        if (!track.trim() || loading) return;

        setLoading(true);
        setRoadmap(null);

        setTimeout(() => {
            const selected = detectRoadmap(track);
            setRoadmap(selected);
            setLoading(false);
        }, 2200);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#fff' }}>
            {/* HERO */}
            <div style={{ textAlign: 'center', padding: '30px 30px' }}>
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '3.2rem', fontWeight: 800 }}
                >
                    Developer Roadmaps
                </motion.h1>

                <p style={{ color: '#64748b', fontSize: '1.2rem' }}>
                    AI-guided learning paths tailored to your goals
                </p>

                <div style={{ maxWidth: '600px', margin: '40px auto', position: 'relative' }}>
                    <input
                        value={track}
                        onChange={(e) => setTrack(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && generateRoadmap()}
                        placeholder="What do you want to learn?"
                        style={{
                            width: '100%',
                            padding: '18px 22px',
                            fontSize: '1.1rem',
                            borderRadius: '12px',
                            border: '2px solid #e5e7eb',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                        }}
                    />
                    <button
                        onClick={generateRoadmap}
                        disabled={loading || !track.trim()}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '10px',
                            bottom: '10px',
                            padding: '0 24px',
                            borderRadius: '10px',
                            background: '#0f172a',
                            color: '#fff',
                            fontWeight: 700,
                            opacity: loading ? 0.6 : 1,
                            cursor: 'pointer'
                        }}
                    >
                        Generate
                    </button>
                </div>
            </div>

            {/* INDUSTRY STANDARDS SECTION */}
            {!roadmap && !loading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ maxWidth: '1200px', margin: '0 auto 80px', padding: '0 30px' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>Industry Standard Roadmaps</h2>
                            <p style={{ color: '#64748b', marginTop: '4px' }}>Curated learning paths for the most in-demand roles in 2024-2025</p>
                        </div>
                    </div>

                    <div className="industry-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '24px'
                    }}>
                        {INDUSTRY_COURSES.map((course, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
                                style={{
                                    padding: '24px',
                                    borderRadius: '20px',
                                    background: '#fff',
                                    border: '1px solid #e5e7eb',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <span style={{
                                            fontSize: '0.65rem',
                                            fontWeight: 800,
                                            textTransform: 'uppercase',
                                            color: '#6366f1',
                                            background: '#f5f3ff',
                                            padding: '4px 8px',
                                            borderRadius: '6px'
                                        }}>
                                            {course.category}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>{course.provider}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', lineHeight: 1.4 }}>{course.title}</h3>
                                </div>

                                <button
                                    onClick={() => {
                                        setTrack(course.title);
                                        setRoadmap(null);
                                        // Trigger generation after a tiny delay
                                        setTimeout(() => {
                                            const selected = detectRoadmap(course.title);
                                            setRoadmap(selected);
                                            window.scrollTo({ top: 400, behavior: 'smooth' });
                                        }, 100);
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '10px',
                                        background: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        color: '#0f172a',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        marginTop: '16px'
                                    }}
                                >
                                    Quick View Roadmap
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .industry-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

            {/* THINKING */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', padding: '80px 20px' }}
                    >
                        <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Infinity, duration: 1.4 }}
                            style={{ fontSize: '1.4rem', fontWeight: 700 }}
                        >
                            {THINKING_STEPS[thinkingStep]}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ROADMAP */}
            <AnimatePresence>
                {roadmap && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <RoadmapVisualizer roadmap={roadmap} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Roadmap;
