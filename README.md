# AI STUDENT GUIDE HUB

A comprehensive AI-powered career guidance platform for B.Tech students, featuring personalized roadmaps, AI mentorship, resume analysis, and interactive learning tools.

## 🚀 Features

### 🎯 AI-Powered Career Guidance
- **Personalized Roadmaps**: Generate custom learning paths based on your year, track, and career goals
- **AI Mentor**: Get expert guidance on technical concepts, career decisions, and interview preparation
- **Resume Analyzer**: AI-powered resume analysis with actionable feedback and job recommendations

### 📊 Interactive Learning
- **Quiz System**: Test your knowledge with interactive quizzes
- **Progress Tracking**: Monitor your learning progress across different domains (DSA, Web Dev, DBMS, etc.)
- **Leaderboard**: Compete with peers and track your performance

### 💼 Career Intelligence
- **Real-time Market Signals**: Stay updated with trending technologies and skills
- **Job Opportunities**: Discover career opportunities tailored to your profile
- **Skill Gap Analysis**: Identify areas for improvement

## 🛠️ Tech Stack

### Frontend
- **React** with Vite
- **Framer Motion** for animations
- **Axios** for API calls
- Modern glassmorphism UI design

### Backend
- **Node.js** with Express
- **MongoDB Atlas** for cloud database
- **Google Gemini AI** for intelligent features
- **Socket.io** for real-time updates
- **JWT** for authentication

### AI & ML
- **Google Gemini API** for AI mentor and roadmap generation
- **PDF parsing** for resume analysis
- Python microservice for advanced resume processing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Google Gemini API key

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Shivakumar-09/AI-STUDENT-GUIDE-HUB.git
cd AI-STUDENT-GUIDE-HUB
```

2. **Install dependencies**

Backend:
```bash
cd server
npm install
```

Frontend:
```bash
cd client
npm install
```

3. **Configure environment variables**

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
JWT_SECRET=your_jwt_secret
```

4. **Run the application**

Start the backend server:
```bash
cd server
node index.js
```

Start the frontend development server:
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## 🎨 Key Components

- **Dashboard**: Overview of your learning journey with progress metrics
- **AI Mentor**: Interactive chat interface for career guidance
- **Roadmap Generator**: Create personalized learning paths
- **Resume Analyzer**: Upload and analyze your resume
- **Quiz Module**: Test your knowledge
- **Profile Management**: Track your skills and progress

## 🔐 Authentication

Secure user authentication with:
- JWT-based token authentication
- Bcrypt password hashing
- Protected API routes

## 📱 Responsive Design

Fully responsive design optimized for:
- Desktop
- Tablet
- Mobile devices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**Shivakumar**
- GitHub: [@Shivakumar-09](https://github.com/Shivakumar-09)

## 🙏 Acknowledgments

- Google Gemini AI for powering the intelligent features
- MongoDB Atlas for cloud database services
- The open-source community for amazing tools and libraries

---

**Built with ❤️ for B.Tech students aspiring for success in their tech careers**
