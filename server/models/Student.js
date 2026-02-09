const mongoose = require('mongoose');

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

module.exports = { Student, Leaderboard };
