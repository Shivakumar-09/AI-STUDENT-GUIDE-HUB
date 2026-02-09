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
    }
};

/* -------------------- ROADMAP DETECTION -------------------- */

const detectRoadmap = (track) => {
    const t = track.toLowerCase();

    if (t.includes('python') && t.includes('full')) {
        return ROADMAP_DEFINITIONS.python_fullstack;
    }

    if (t.includes('react') || t.includes('frontend')) {
        return ROADMAP_DEFINITIONS.react_frontend;
    }

    if (t.includes('ai') || t.includes('ml')) {
        return ROADMAP_DEFINITIONS.ai_engineer;
    }

    return {
        title: track,
        summary: `A structured roadmap to master <strong>${track}</strong> from fundamentals to production.`,
        weeks: [
            {
                title: 'Foundations',
                focus: 'Core concepts.',
                topics: ['Basics', 'Syntax', 'Data Structures'],
                project: 'CLI Tool',
                status: 'completed'
            },
            {
                title: 'Advanced Concepts',
                focus: 'Architecture and optimization.',
                topics: ['Design Patterns', 'Async'],
                project: 'Processing Engine',
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
                            border: '2px solid #e5e7eb'
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
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        Generate
                    </button>
                </div>
            </div>

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
