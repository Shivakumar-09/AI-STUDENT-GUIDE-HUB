// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const { GoogleGenerativeAI } = require("@google/generative-ai");

// ------------------------
// MONGODB SCHEMAS
// ------------------------
const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    year: { type: String },
    track: { type: String },
    skills: { type: [String], default: [] },
    targetJobs: { type: [String], default: [] },
    progress: {
        prog: { type: Number, default: 0 },
        dsa: { type: Number, default: 0 },
        web: { type: Number, default: 0 },
        proj: { type: Number, default: 0 },
        dbms: { type: Number, default: 0 },
        interview: { type: Number, default: 0 },
    },
    quizScores: [{
        score: Number,
        total: Number,
        date: { type: Date, default: Date.now }
    }]
});

const LeaderboardSchema = new mongoose.Schema({
    name: String,
    score: Number,
    date: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', StudentSchema);
const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema);

// ------------------------
// GEMINI AI CONFIG
// ------------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const getGeminiResponse = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini API Error details:", {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        throw error;
    }
};

const getGeminiChatResponse = async (history, message) => {
    let validHistory = [];
    try {
        validHistory = Array.isArray(history) ? history.filter(h => h.role && h.parts) : [];
        while (validHistory.length > 0 && validHistory[0].role !== "user") {
            validHistory.shift();
        }
        const chat = model.startChat({ history: validHistory });
        const result = await chat.sendMessage(message);
        return result.response.text();
    } catch (error) {
        console.error("Gemini Chat API Error details:", {
            message: error.message,
            stack: error.stack,
            history: validHistory,
            messageSent: message
        });
        throw error;
    }
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});


const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'road2success_secret_key_123';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

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
        const existingUser = await Student.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Student({
            name,
            email,
            password: hashedPassword,
            phone: phone || '',
            skills: (typeof skills === 'string' && skills.trim()) ? skills.split(',').map(s => s.trim()) : [],
            targetJobs: (typeof targetJobs === 'string' && targetJobs.trim()) ? targetJobs.split(',').map(j => j.trim()) : []
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email } });
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

        const user = await Student.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
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
        const user = await Student.findById(decoded.id);
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
const multer = require('multer');
const pdfParse = require('pdf-parse');
const pdf = pdfParse.default || pdfParse;

// Configure Multer (Memory Storage)
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/resume-analyze', upload.single('file'), async (req, res) => {
    try {
        let resumeText = "";

        if (req.file) {
            // Parse PDF from buffer
            const data = await pdf(req.file.buffer);
            resumeText = data.text;
        } else if (req.body.fallback_text) {
            resumeText = req.body.fallback_text;
        } else {
            return res.status(400).json({ error: "No resume file or text provided" });
        }

        // Send to Gemini
        const prompt = `Analyze this resume for a B.Tech student targeting tech roles.
        Return JSON with score (0-100), improved_summary, feedback (HTML), and jobs_html (HTML).
        Resume: ${resumeText}`;

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

        const analysis = JSON.parse(jsonStr);
        res.json(analysis);

    } catch (error) {
        console.error("Resume Analysis Error:", error);
        res.status(500).json({ error: "Resume analysis failed." });
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
        const scores = await Leaderboard.find().sort({ score: -1, date: -1 }).limit(10);
        res.json(scores);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
});

app.post('/api/leaderboard', async (req, res) => {
    try {
        const { name, score } = req.body;
        const newEntry = new Leaderboard({ name, score });
        await newEntry.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to save score" });
    }
});

// ------------------------
// Health Check
// ------------------------
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Road2Success Backend is running' });
});

// ------------------------
// Start Server
// ------------------------

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
