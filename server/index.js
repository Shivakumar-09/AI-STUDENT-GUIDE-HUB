// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const { getGeminiResponse, getGeminiChatResponse } = require('./utils/gemini');
const { sequelize, User, Leaderboard } = require('./models');

// ------------------------
// GEMINI AI CONFIG
// ------------------------
// (OpenAI config removed as we are migrating to Gemini)

// OpenAI chat helper removed


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});


const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'road2success_secret_key_123';

// Middleware
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL, /\.vercel\.app$/]
        : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

// PostgreSQL Connection is handled in config/database.js and synced above
// But we can authenticate to check connection
sequelize.authenticate()
    .then(() => console.log('Connected to PostgreSQL via Sequelize'))
    .catch(err => console.error('PostgreSQL connection error:', err));

// ------------------------
// Socket.io Real-time
// ------------------------
io.on('connection', (socket) => {
    console.log('User connected for career intelligence:', socket.id);

    socket.emit('marketSignal', {
        label: 'System Design Patterns',
        trend: 'Critical',
        color: 'var(--danger)',
        timestamp: new Date()
    });

    const interval = setInterval(() => {
        const signals = [
            { label: 'Cloud Native Adoption', trend: '+28%', color: 'var(--progress)' },
            { label: 'Microservices Mastery', trend: 'High', color: 'var(--learning)' },
            { label: 'Rust for High Perf', trend: 'Emerging', color: 'var(--intelligence)' },
            { label: 'AI Integration (LLMs)', trend: 'Explosive', color: 'var(--danger)' }
        ];
        const randomSignal = signals[Math.floor(Math.random() * signals.length)];
        socket.emit('marketSignal', { ...randomSignal, timestamp: new Date() });
    }, 15000);

    socket.on('disconnect', () => {
        console.log('User disconnected from career intelligence');
        clearInterval(interval);
    });
});

// ------------------------
// Auth Routes
// ------------------------
app.post('/api/auth/register', async (req, res) => {
    try {
        let { name, email, password, phone, skills, targetJobs } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        email = email.toLowerCase().trim();
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phone: phone || '',
            skills: (typeof skills === 'string' && skills.trim()) ? skills.split(',').map(s => s.trim()) : [],
            targetJobs: (typeof targetJobs === 'string' && targetJobs.trim()) ? targetJobs.split(',').map(j => j.trim()) : []
        });

        const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "Registration failed: " + err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        if (email) email = email.toLowerCase().trim();

        if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Login failed: " + err.message });
    }
});

// ------------------------
// JWT Auth Middleware
// ------------------------
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error();

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) throw new Error();

        req.user = user;
        next();
    } catch {
        res.status(401).json({ message: "Please authenticate" });
    }
};

// ------------------------
// Profile Routes
// ------------------------
app.get('/api/profile', auth, (req, res) => res.json(req.user));

app.post('/api/profile', auth, async (req, res) => {
    try {
        const { year, track } = req.body;
        req.user.year = year;
        req.user.track = track;
        await req.user.save();
        res.json(req.user);
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});

// ------------------------
// AI Mentor Route
// ------------------------
app.post('/api/ai/mentor', async (req, res) => {
    try {
        const { question, history, short, eli5 } = req.body;

        let systemPrompt = `You are an expert academic and career mentor for B.Tech students.
${short ? "Keep answers concise." : ""}
${eli5 ? "Explain things very simply." : ""}`;

        console.log("Mentor question:", question);

        const answer = await getGeminiChatResponse(history || [], `${systemPrompt}\n\nUser Question: ${question}`);
        res.json({ answer });
    } catch (error) {
        console.error("Mentor Error:", error);
        res.status(500).json({ error: "AI Mentor is currently unavailable." });
    }
});

// ------------------------
// AI Roadmap Route
// ------------------------
app.post('/api/ai/roadmap', async (req, res) => {
    try {
        const { year, track, days, goal } = req.body;
        const numDays = parseInt(days) || 30;

        if (!process.env.GEMINI_API_KEY) {
            console.error("CRITICAL: GEMINI_API_KEY is missing from environment.");
            return res.status(500).json({ error: "Gemini API Key is not configured on the server." });
        }

        const prompt = `
            You are an expert career architect from roadmap.sh. 
            Generate a high-quality, professional study roadmap for a ${year} B.Tech student.
            
            PARTICULARS:
            - Track: ${track}
            - Timeline: ${numDays} days
            - Primary Goal/Mission: ${goal || 'General Mastery'}
            
            REQUIRED OUTPUT FORMAT (STRICT JSON ONLY):
            {
                "summary": "A 2-3 sentence strategic overview of the mission path (HTML formatted with <strong> or <em>).",
                "weeks": [
                    {
                        "title": "Clear, punchy week title (e.g., Foundations & Core Patterns)",
                        "focus": "Brief description of the specific knowledge areas covered this week.",
                        "topics": ["Start Topic 1", "Topic 2", "Topic 3"],
                        "project": "One concrete mini-project or milestone task to build this week.",
                        "status": "pending"
                    }
                ]
            }
            
            GUIDELINES:
            - Content must be technical, practical, and aligned with industry standards (like roadmap.sh).
            - Break down the ${numDays} days into appropriate weekly chunks.
            - Focus heavily on the student's primary goal: ${goal}.
            - "topics" should be short, tag-like concepts (e.g., "Hooks", "Redux", "JWT").
            - DO NOT include any text outside the JSON block.
        `;

        console.log(`[Roadmap] Request received: Year=${year}, Track=${track}, Goal=${goal}`);

        const responseText = await getGeminiResponse(prompt);
        console.log("[Roadmap] Raw AI Response Length:", responseText.length);

        // Robust JSON extraction
        let jsonStr = responseText.trim();

        // Remove markdown code blocks if present
        if (jsonStr.includes('```')) {
            jsonStr = jsonStr.replace(/```json|```/g, '').trim();
        }

        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }

        try {
            const roadmapData = JSON.parse(jsonStr);
            console.log("[Roadmap] Successfully parsed JSON for:", goal);
            res.json(roadmapData);
        } catch (parseError) {
            console.error("[Roadmap] JSON Parse Error. Raw output was:", responseText);
            throw new Error("AI returned invalid JSON format. Please try again.");
        }

    } catch (error) {
        console.error("Roadmap API Error:", error.message);
        res.status(500).json({ error: error.message || "Failed to generate roadmap." });
    }
});

// ------------------------
// Resume Analysis (Native Node.js)
// ------------------------
// ------------------------
// Resume Analysis (Native Node.js)
// ------------------------
const multer = require('multer');
const pdfParse = require('pdf-parse');
const pdf = pdfParse;

// Configure Multer (Memory Storage)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

app.post('/api/resume-analyze', upload.single('file'), async (req, res) => {
    try {
        console.log("[Resume Analysis] Request received");

        if (!process.env.GEMINI_API_KEY) {
            console.error("[Resume Analysis] Error: GEMINI_API_KEY is missing.");
            return res.status(500).json({ error: "Server configuration error: Gemini API key is missing." });
        }

        let resumeText = "";

        if (req.file) {
            console.log("[Resume Analysis] Processing PDF file:", req.file.originalname);
            try {
                // Ensure proper extraction from buffer
                const data = await pdf(req.file.buffer);
                resumeText = data.text;
                console.log("[Resume Analysis] PDF extracted length:", resumeText.length);
            } catch (pdfError) {
                console.error("[Resume Analysis] PDF Parse Error:", pdfError);
                return res.status(400).json({ error: "Failed to read PDF file. Ensure it is a valid, non-encrypted PDF." });
            }
        } else if (req.body.fallback_text) {
            console.log("[Resume Analysis] Using fallback text");
            resumeText = req.body.fallback_text;
        } else {
            console.warn("[Resume Analysis] No content provided");
            return res.status(400).json({ error: "No resume file or text provided. Please upload a PDF or paste resume text." });
        }

        if (!resumeText.trim()) {
            return res.status(400).json({ error: "Resume content is empty. Please check your file." });
        }

        // Send to Gemini
        const prompt = `
            Analyze this resume for a B.Tech student targeting tech roles.
            Focus on matching standards for companies like Google, Amazon, Microsoft, and Meta.
            
            Return ONLY a valid JSON object with the following structure:
            {
                "score": 0-100 (integer),
                "improved_summary": "A 3-4 line professional summary highlighting strengths",
                "feedback": "HTML formatted list of improvements (use <ul> and <li>)",
                "jobs_html": "HTML formatted suggested job roles and target sectors"
            }

            Resume Content:
            ${resumeText.substring(0, 4000)}
        `;

        console.log("[Resume Analysis] Sending to AI...");
        const responseText = await getGeminiResponse(prompt);

        // Robust JSON extraction
        let jsonStr = responseText.trim();
        if (jsonStr.includes('```')) {
            jsonStr = jsonStr.replace(/```json|```/g, '').trim();
        }
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }

        try {
            const analysis = JSON.parse(jsonStr);
            console.log("[Resume Analysis] Success. Score:", analysis.score);
            res.json(analysis);
        } catch (parseError) {
            console.error("[Resume Analysis] JSON Parsing Error. Raw AI response:", responseText);
            res.status(500).json({ error: "AI returned an invalid response format. Please try again." });
        }

    } catch (error) {
        console.error("[Resume Analysis] Critical Error:", error);
        res.status(500).json({
            error: "Resume analysis failed due to a server error. Please try again later.",
            details: error.message
        });
    }
});

// ------------------------
// AI Resume Feedback
// ------------------------
app.post('/api/ai/resume', async (req, res) => {
    try {
        const { text } = req.body;
        const prompt = `Analyze this resume for a B.Tech student targeting tech roles.
Return JSON with score (0-100), feedback (HTML), and jobs array.
Resume: ${text}`;

        const responseText = await getGeminiResponse(prompt);
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : responseText;

        res.json(JSON.parse(jsonStr));
    } catch (error) {
        console.error("Resume Analysis Error:", error);
        res.status(500).json({ error: "Resume analysis failed." });
    }
});

// ------------------------
// Leaderboard Routes
// ------------------------
app.get('/api/leaderboard', async (req, res) => {
    try {
        const scores = await Leaderboard.findAll({
            order: [['score', 'DESC'], ['date', 'DESC']],
            limit: 10
        });
        res.json(scores);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
});

app.post('/api/leaderboard', async (req, res) => {
    try {
        const { name, score } = req.body;
        await Leaderboard.create({ name, score });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to save score" });
    }
});

// ------------------------
// Live Internships API (Migrated from Python)
// ------------------------
app.get('/api/live-internships', (req, res) => {
    const { keyword, track, company_type } = req.query;

    // In a real app, filtering logic would go here based on query params

    const data = [
        {
            title: "Customer Solutions Engineer (2026 Batch)",
            company: "Google",
            location: "India",
            stipend: "Full Time",
            track: "Tech Consultant",
            apply_url: "https://www.google.com/about/careers/applications/jobs/results/143042321036780230-customer-and-partner-solutions-engineer-university-graduate-2026"
        },
        {
            title: "SDE 1 (2024/2025 Batch)",
            company: "Licious",
            location: "India",
            stipend: "Competitive",
            track: "Software Development",
            apply_url: "https://www.linkedin.com/jobs/view/4359065500/"
        },
        {
            title: "AI/Analytics Internship (2026/27 Batch)",
            company: "Discover Dollar",
            location: "Remote / Bangalore",
            stipend: "Stipend Available",
            track: "Data / AI",
            apply_url: "https://discoverdollar.keka.com/careers/jobdetails/91847"
        },
        {
            title: "SDE 1 (2023/2024 Batch)",
            company: "Microsoft",
            location: "India",
            stipend: "Competitive",
            track: "Software Development",
            apply_url: "http://apply.careers.microsoft.com/careers/job/1970393556652368"
        },
        {
            title: "SDE 2 (Exp required)",
            company: "Amazon",
            location: "India",
            stipend: "High Paying",
            track: "Software Development",
            apply_url: "https://www.amazon.jobs/en/jobs/3159335/software-development-engineer-amazon-smart-vehicles"
        },
        {
            title: "Software Engineer (2028 Batch)",
            company: "Cisco",
            location: "Bangalore / Hybrid",
            stipend: "High Paying",
            track: "Software Development",
            apply_url: "https://careers.cisco.com/global/en/job/CISCISGLOBAL2006873EXTERNALENGLOBAL/Software-Engineer-Network-Embedded-Application-Development-Intern-India-UHR"
        },
        {
            title: "Product Support Engineer (2026 Batch)",
            company: "Google",
            location: "India",
            stipend: "Competitive",
            track: "Software / Support",
            apply_url: "https://www.google.com/about/careers/applications/jobs/results/81631668531536582-product-support-engineer,-university-graduate,-2026"
        },
        {
            title: "SURGE Internship (IIT Kanpur)",
            company: "IIT Kanpur",
            location: "Kanpur (On-campus)",
            stipend: "₹16,000 / ₹8,000",
            track: "Research / Engineering",
            apply_url: "https://surge.iitk.ac.in/about"
        },
        {
            title: "SURAJ Internship (IIT Jodhpur)",
            company: "IIT Jodhpur",
            location: "Jodhpur",
            stipend: "₹6,000/month",
            track: "Research",
            apply_url: "https://www.iitj.ac.in/suraj/en/eligibility"
        },
        {
            title: "Summer Fellowship (IIT Madras)",
            company: "IIT Madras",
            location: "Madras",
            stipend: "₹15,000/month",
            track: "Research",
            apply_url: "https://ssp.iitm.ac.in/summer-fellowship-registration"
        },
        {
            title: "Internship (AI/5G/Compute)",
            company: "Qualcomm India",
            location: "India",
            stipend: "Market Standard",
            track: "Hardware / AI / Systems",
            apply_url: "mailto:spanmunu@qti.qualcomm.com?subject=Internship%20Application"
        }
    ];

    res.json(data);
});

// ------------------------
// Live Hackathons API (Migrated from Python)
// ------------------------
app.get('/api/live-hackathons', (req, res) => {
    const { keyword, type, level } = req.query;

    const data = [
        {
            title: "Career Verse (Naukri)",
            description: "25K+ jobs, 5L+ rewards. 2026-29 Batches.",
            mode: "Online",
            perks: "Jobs + Goodies",
            url: "https://tinyurl.com/naukri-careerverse"
        },
        {
            title: "DecodeX (NL Dalmia)",
            description: "Coding challenge for 2026/2027 batch. 1.75L Prizes.",
            mode: "Online",
            perks: "Cash + PPI",
            url: "https://tinyurl.com/decodex-nldalmia"
        },
        {
            title: "Synthesis (NL Dalmia)",
            description: "Tech challenge for all years. 1.05L Prizes.",
            mode: "Online",
            perks: "Cash + PPI",
            url: "https://tinyurl.com/syntehsis-nldalmia"
        },
        {
            title: "Seed Global Profile Eval",
            description: "Free profile evaluation for US jobs/internships.",
            mode: "Online",
            perks: "Free Evaluation",
            url: "https://seedglobal.io/f168ceec7"
        },
        {
            title: "Seed Global Meetup",
            description: "Scholarship & Free Event in Delhi/Mumbai/Bangalore/Indore.",
            mode: "In-Person",
            perks: "Scholarship + Networking",
            url: "https://seedglobal.io/arsh"
        }
    ];

    res.json(data);
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Road2Success Backend is running' });
});

// ------------------------
// Start Server
// ------------------------

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
