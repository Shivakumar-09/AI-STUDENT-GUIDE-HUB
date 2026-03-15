# 🎓 AI Student Guide Hub

![Project Banner](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/Frontend-React_19-blue)
![Vite](https://img.shields.io/badge/Bundler-Vite-purple)
![Nodejs](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/Framework-Express-lightgray)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Gemini AI](https://img.shields.io/badge/AI-Gemini_Pro-orange)

**AI Student Guide Hub** is a comprehensive, full-stack platform designed to accelerate tech careers for B.Tech students. It leverages advanced Generative AI (Google Gemini) to provide tailored career intelligence, intelligent study roadmaps, AI-driven mock interviews, interactive quizzes, and automated resume analysis, alongside real-time market signals for top tech and MAANG interviews.

---

## 🚀 Key Features

- **🤖 AI Mentor (Gemini Powered)**: Get personalized, expert academic and career guidance with adjustable detail (concise, ELI5).
- **🗺️ Intelligent Study Roadmaps**: Generate highly structured, dynamic weekly learning roadmaps aligned with distinct tracks (e.g., Software Development, Data/AI) to hit specific career goals.
- **🎙️ AI Mock Interviews**: Participate in realistic interview simulations with dynamic questioning, speech-to-text, and real-time AI evaluation using text-to-speech feedback.
- **📄 Smart Resume Analyzer**: Upload a PDF resume to instantly receive an ATS compatibility score, improved professional summaries, structural feedback, and recommended target jobs.
- **🧠 Dynamic Quiz Generation**: Automatically produce multiple-choice tech quizzes on any specified domain to challenge knowledge aligned with MAANG interview rigor.
- **📈 Real-Time Market Signals**: Stay updated with live, socket-driven career intelligence streams tracking emerging technologies and hiring trends (e.g., "Cloud Native Adoption +28%").
- **💼 Live Internships & Hackathons**: Access curated databases of active internship postings and competitive tech hackathons.
- **🏅 Leaderboard System**: Track points and rank against other students on the platform using an interactive leaderboard.
- **🔐 Secure Authentication**: Features full Role-Based Access Control (RBAC) with secure JWT-based Student and Admin portals. Data at rest is structurally encrypted.

---

## 🛠️ Tech Stack

### Frontend (User & Admin Portals)
- **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Routing**: React Router DOM (v7)
- **Styling & Animations**: Vanilla CSS / Utilities, [Framer Motion](https://www.framer.com/motion/) for fluid UI micro-interactions
- **Icons**: Lucide React
- **Real-time**: Socket.IO Client
- **Requests**: Axios

### Backend (REST API Server)
- **Runtime & Framework**: [Node.js](https://nodejs.org/en) (v16+) & Express (v5)
- **Database ORM**: Sequelize (for PostgreSQL via `pg`)
- **AI Integration**: `@google/generative-ai` (Gemini Pro)
- **Authentication**: JWT (`jsonwebtoken`) & Bcrypt (`bcryptjs`)
- **File Parsing**: `multer` (Uploads) & `pdf-parse` (Resume text extraction)
- **Real-time Socket**: Socket.IO Server

---

## 📂 Repository Structure

This project is built as a Monorepo containing both the React frontend and the Node.js backend.

```text
AI-STUDENT-GUIDE-HUB/
├── client/                 # React Frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components and App Views
│   │   ├── config/         # Environment routing & config
│   │   ├── main.jsx        # Frontend entry point
│   │   └── index.css       # Core styling system
│   ├── package.json
│   └── vite.config.js      # Vite configuration
│   
└── server/                 # Express Backend application
    ├── config/             # Database connection setups
    ├── models/             # Sequelize Data Models (User, Admin, Leaderboard)
    ├── utils/              # Helper utilities (encryption, gemini integration)
    ├── index.js            # Main REST API and Socket server
    └── package.json
```

---

## 💻 Getting Started (Local Development)

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **PostgreSQL** installed and running locally.
- A valid **Google Gemini API Key**.

### 2. Clone the Repository
```bash
git clone https://github.com/Shivakumar-09/AI-STUDENT-GUIDE-HUB.git
cd AI-STUDENT-GUIDE-HUB
```

### 3. Setup the Backend Server

Navigate to the `server` directory, install dependencies, and configure environment variables.

```bash
cd server
npm install
```

Create a `.env` file in the `server` root with the following structure:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# PostgreSQL Database Configuration
DB_NAME=your_database_name
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432

# Authentication & Security
JWT_SECRET=your_super_secret_jwt_key
ENCRYPTION_KEY=your_32_byte_hex_encryption_key

# External APIs
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Setup the Frontend Client

Open a new terminal, navigate to the `client` directory, and install dependencies.

```bash
cd ../client
npm install
```

### 5. Run the Application

Start both the backend API server and the frontend client simultaneously.

**Backend Terminal:**
```bash
cd server
npm start
```
*The server will sync database tables automatically via Sequelize and start on `http://localhost:5000`.*

**Frontend Terminal:**
```bash
cd client
npm run dev
```
*The client will be running on `http://localhost:5173`. Open this URL in your browser.*

---

## 👨‍💻 Admin Scripts

The server provides built-in utilities for seeding Admin users securely. To create or update an admin account, run these scripts from the `server` directory:

```bash
node createAdmin.js
# Or to forcibly update an existing admin:
node forceUpdateAdmin.js
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/Shivakumar-09/AI-STUDENT-GUIDE-HUB/issues) if you want to contribute.

---
*Built to empower the next generation of tech talent.* 💡
