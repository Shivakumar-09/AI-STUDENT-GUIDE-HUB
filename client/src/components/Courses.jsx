import React, { useState } from 'react';

const Courses = () => {
    const [filter, setFilter] = useState('All');

    const courseData = [
        {
            title: "AI Engineer 2026: Gen AI, Deep Learning & LLMs",
            platform: "Udemy via FreeCourse.io",
            instructor: "Top Rated Instructor",
            modules: 42,
            duration: "32h 15m",
            logo: "🤖",
            color: "#7c3aed",
            category: "Data Science",
            badge: "COUPON: FEBFREE02",
            rating: 4.8,
            link: "https://freecourse.io/courses/ai-enginner-2026-complete-course-gen-ai-deep-machine-llm"
        },
        {
            title: "Data Structures & Algorithms: Developer’s Guide",
            platform: "Coursevania Premium",
            instructor: "Industry Expert",
            modules: 55,
            duration: "28h 45m",
            logo: "🧩",
            color: "#2563eb",
            category: "Web Dev",
            badge: "COUPON: E1D9...7A67",
            rating: 4.9,
            link: "https://coursevania.com/courses/data-structures-and-algorithms-complete-developers-guide/"
        },
        {
            title: "Figma AI Mastery: Design Faster with AI",
            platform: "Udemy via FreeCourse.io",
            instructor: "Design Lead",
            modules: 18,
            duration: "8h 30m",
            logo: "🎨",
            color: "#ec4899",
            category: "Web Dev",
            badge: "COUPON: WINTERWISDOM26",
            rating: 4.7,
            link: "https://freecourse.io/courses/figma-ai-mastery-design-faster-with-ai-powered-workflows"
        },
        {
            title: "AI Email Marketing Mastery: Automation & Sales",
            platform: "Udemy via FreeCourse.io",
            instructor: "Marketing Pro",
            modules: 22,
            duration: "10h 15m",
            logo: "📧",
            color: "#f59e0b",
            category: "Web Dev",
            badge: "COUPON: 2ADE...64925",
            rating: 4.6,
            link: "https://freecourse.io/courses/ai-email-marketing-mastery-automation-segmentation-sales"
        },
        {
            title: "Deepfake Detection: Master AI Forensics",
            platform: "Udemy via FreeCourse.io",
            instructor: "Cyber Security Expert",
            modules: 15,
            duration: "12h 00m",
            logo: "🛡️",
            color: "#ef4444",
            category: "Security",
            badge: "COUPON: 5346...0CDB",
            rating: 4.9,
            link: "https://freecourse.io/courses/deepfake-detection-master-ai-forensics-for-enterprise"
        },
        {
            title: "Vibe Coding Masterclass: No-Code App Builder",
            platform: "Udemy via FreeCourse.io",
            instructor: "No-Code Architect",
            modules: 20,
            duration: "14h 20m",
            logo: "⚡",
            color: "#06b6d4",
            category: "Web Dev",
            badge: "COUPON: 8AE8...A7FD",
            rating: 4.8,
            link: "https://freecourse.io/courses/the-ultimate-no-code-app-development-masterclass-2025"
        },
        {
            title: "Complete Full-Stack AI Engineer Bootcamp",
            platform: "Udemy via FreeCourse.io",
            instructor: "Full Stack Lead",
            modules: 60,
            duration: "45h 00m",
            logo: "🚀",
            color: "#16a34a",
            category: "Data Science",
            badge: "COUPON: AIENGFEB26",
            rating: 4.9,
            link: "https://freecourse.io/courses/complete-full-stack-ai-engineer-bootcamp-masterclass"
        },
        {
            title: "AI & Cyber Security Mastery 2025",
            platform: "Udemy via FreeCourse.io",
            instructor: "Security Expert",
            modules: 28,
            duration: "18h 45m",
            logo: "🔐",
            color: "#dc2626",
            category: "Security",
            badge: "COUPON: 401F...E067",
            rating: 4.9,
            link: "https://freecourse.io/courses/ai-cyber-security-mastery"
        },
        {
            title: "Python with Machine Learning: Start Building AI Models",
            platform: "Udemy via FreeCourse.io",
            instructor: "ML Instructor",
            modules: 35,
            duration: "21h 10m",
            logo: "🐍",
            color: "#eab308",
            category: "Data Science",
            badge: "COUPON: 3CC4...E6F5",
            rating: 4.8,
            link: "https://freecourse.io/courses/python-with-machine-learning-start-building-ai-models-today"
        },
        {
            title: "MySQL & Database Management: Create, Manage & Query",
            platform: "Udemy via FreeCourse.io",
            instructor: "DB Admin",
            modules: 40,
            duration: "25h 30m",
            logo: "🐬",
            color: "#0891b2",
            category: "Web Dev",
            badge: "COUPON: 4D40...770B",
            rating: 4.7,
            link: "https://freecourse.io/courses/mysql-database-management-create-manage-query-database"
        },
        {
            title: "Flutter for Web & Mobile: Build Fast, Flexible Apps",
            platform: "Udemy via FreeCourse.io",
            instructor: "Flutter Expert",
            modules: 32,
            duration: "26h 45m",
            logo: "💙",
            color: "#02569B",
            category: "Web Dev",
            badge: "COUPON: 4BDC...4BF4",
            rating: 4.8,
            link: "https://freecourse.io/courses/flutter-for-web-mobile-build-fast-flexible-applications"
        },
        {
            title: "AI & Python Development Megaclass - 300+ Projects",
            platform: "Udemy via FreeCourse.io",
            instructor: "AI Master",
            modules: 100,
            duration: "60h 00m",
            logo: "🐍",
            color: "#306998",
            category: "Data Science",
            badge: "COUPON: FEBFREE02",
            rating: 4.9,
            link: "https://freecourse.io/courses/ai-python-development-megaclass-300-hands-on-projects"
        },
        {
            title: "ChatGPT for Product Management & Innovation",
            platform: "Udemy via FreeCourse.io",
            instructor: "Product Lead",
            modules: 15,
            duration: "8h 30m",
            logo: "💡",
            color: "#10a37f",
            category: "Data Science",
            badge: "COUPON: 299A...7E13",
            rating: 4.7,
            link: "https://freecourse.io/courses/chatgpt-for-product-management-innovation-aece"
        },
        {
            title: "Python Automation and Data Science Bootcamp",
            platform: "Udemy via FreeCourse.io",
            instructor: "Data Scientist",
            modules: 45,
            duration: "35h 15m",
            logo: "⚙️",
            color: "#FFD43B",
            category: "Data Science",
            badge: "COUPON: BDEF...0BD6",
            rating: 4.8,
            link: "https://freecourse.io/courses/python-automation-and-data-science-bootcamp-zero-to-hero"
        },
        {
            title: "Practical Hacking & Pentesting for Beginners",
            platform: "Coursevania",
            instructor: "Security Lead",
            modules: 25,
            duration: "15h 30m",
            logo: "🔐",
            color: "#dc2626",
            category: "Security",
            badge: "COUPON: 696B...EBCA",
            rating: 4.9,
            link: "https://coursevania.com/courses/practical-hacking-and-pentesting-course-for-beginners/"
        },
        {
            title: "Mastering Linux Text Processing: Grep, Sed, Awk",
            platform: "Udemy via FreeCourse.io",
            instructor: "DevOps Pro",
            modules: 12,
            duration: "6h 45m",
            logo: "🐧",
            color: "#000000",
            category: "Cloud",
            badge: "COUPON: 85D5...BAA0",
            rating: 4.8,
            link: "https://freecourse.io/courses/mastering-grep-sed-and-awk"
        },
        {
            title: "PySpark for Big Data: Data Engineering & MLlib",
            platform: "Udemy via FreeCourse.io",
            instructor: "Data Architect",
            modules: 40,
            duration: "22h 15m",
            logo: "🔥",
            color: "#ea580c",
            category: "Data Science",
            badge: "COUPON: BF9C...1E1F",
            rating: 4.7,
            link: "https://freecourse.io/courses/pyspark-for-big-data-master-data-engineering-mllib-test"
        },
        {
            title: "Blender Essential: From Beginner to 3D Master",
            platform: "Udemy via FreeCourse.io",
            instructor: "3D Artist",
            modules: 35,
            duration: "18h 30m",
            logo: "🎨",
            color: "#ea580c",
            category: "Web Dev",
            badge: "COUPON: BDBF...298E6",
            rating: 4.9,
            link: "https://freecourse.io/courses/blender-essential-from-beginner-to-3d-masterclass"
        },
        {
            title: "Python GUI with Tkinter: Build Desktop Apps",
            platform: "Udemy via FreeCourse.io",
            instructor: "Python Expert",
            modules: 20,
            duration: "12h 00m",
            logo: "🖥️",
            color: "#374151",
            category: "Web Dev",
            badge: "COUPON: WOOLY...KS26",
            rating: 4.6,
            link: "https://freecourse.io/courses/python-gui-development-with-tkinter-build-pro-desktop-apps"
        },
        {
            title: "Complete Computer Course: Hardware & Software",
            platform: "Udemy via FreeCourse.io",
            instructor: "IT Specialist",
            modules: 50,
            duration: "30h 00m",
            logo: "💻",
            color: "#2563eb",
            category: "Cloud",
            badge: "COUPON: HELP...ANDS",
            rating: 4.8,
            link: "https://freecourse.io/courses/computer-course-hardware-and-software-skills-part-1"
        }
    ];

    const categories = ['All', 'Data Science', 'Cloud', 'Security', 'Web Dev'];

    const filteredCourses = filter === 'All'
        ? courseData
        : courseData.filter(c => c.category === filter);

    return (
        <section style={{ marginTop: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '8px' }}>
                        Curated Learning Academy 🎓
                    </h2>
                    <p style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Curated free resources extracted from premium sources.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '6px', borderRadius: '16px' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            style={{
                                padding: '8px 16px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, border: 'none',
                                background: filter === cat ? '#fff' : 'transparent',
                                color: filter === cat ? 'var(--accent)' : 'var(--text-dim)',
                                cursor: 'pointer', transition: '0.2s', boxShadow: filter === cat ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* COURSEVANIA BANNER */}
            <div
                style={{
                    background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                    borderRadius: '20px',
                    padding: '24px 32px',
                    marginBottom: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#fff',
                    boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)'
                }}
            >
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', opacity: 0.9 }}>Official Partner</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '4px' }}>Powered by Coursevania</h3>
                    <p style={{ opacity: 0.9, maxWidth: '500px', lineHeight: 1.5, fontSize: '0.9rem' }}>
                        Access 1000+ premium courses for free including Coursera, Udemy, and more. Join the exclusive channel for daily updates.
                    </p>
                </div>
                <a
                    href="https://t.me/Coursevania"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        background: '#fff',
                        color: 'var(--learning)',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'transform 0.2s'
                    }}
                >
                    JOIN CHANNEL 🚀
                </a>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '32px'
            }}>
                {filteredCourses.map((course, idx) => (
                    <div
                        key={idx}
                        onClick={() => window.open(course.link, '_blank')}
                        style={{
                            background: '#fff', borderRadius: '28px', overflow: 'hidden',
                            border: '1px solid var(--border-subtle)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                            display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s'
                        }}
                    >
                        {/* THE CARD TOP AREA */}
                        <div style={{
                            height: '120px', background: `linear-gradient(135deg, ${course.color}, ${course.color}dd)`,
                            position: 'relative', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
                        }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '1.4rem'
                            }}>
                                {course.logo}
                            </div>
                            <div style={{
                                padding: '6px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.25)',
                                color: '#fff', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.05em', backdropFilter: 'blur(10px)'
                            }}>
                                {course.badge}
                            </div>
                        </div>

                        {/* CONTENT AREA */}
                        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                                {course.platform} API
                            </div>
                            <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.4, marginBottom: '20px', minHeight: '3.2rem' }}>
                                {course.title}
                            </h4>

                            <div style={{ display: 'flex', itemsCenter: 'center', gap: '10px', marginBottom: '24px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', display: 'grid', placeItems: 'center', fontSize: '0.8rem' }}>👤</div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>{course.instructor}</div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-dim)' }}>Lead Strategist</div>
                                </div>
                                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ color: '#fbbf24' }}>★</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 900 }}>{course.rating}</span>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                paddingTop: '16px', borderTop: '1px dashed var(--border-subtle)', marginTop: 'auto'
                            }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '1rem' }}>📑</span>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)' }}>{course.modules} Units</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '1rem' }}>🕓</span>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)' }}>{course.duration}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* HOVER ACTION AREA (BUTTON) */}
                        <div style={{ padding: '16px 24px 24px' }}>
                            <button
                                style={{
                                    width: '100%', padding: '14px', borderRadius: '16px',
                                    background: 'blue', color: '#fff', fontWeight: 900,
                                    border: 'none', cursor: 'pointer', fontSize: '0.85rem'
                                }}
                            >
                                START LEARNING NOW
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Courses;
