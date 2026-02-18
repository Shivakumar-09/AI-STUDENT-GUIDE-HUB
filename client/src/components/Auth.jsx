import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import API_URL from "../config/api";

const Auth = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

        try {
            const response = await axios.post(`${API_URL}${endpoint}`, formData);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            onLogin(response.data.user);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">

            {/* Animated Background Blobs */}
            <div className="bg-blobs">
                <div className="blob blob1"></div>
                <div className="blob blob2"></div>
                <div className="blob blob3"></div>
            </div>

            <motion.div
                className="auth-card"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="logo">⚡</div>

                <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>
                <p>
                    {isLogin
                        ? "Continue building your engineering journey."
                        : "Start your path toward top product companies."}
                </p>

                <form onSubmit={handleSubmit}>
                    <AnimatePresence>
                        {!isLogin && (
                            <motion.input
                                key="name"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                            />
                        )}
                    </AnimatePresence>

                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                    />

                    <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                    />

                    {error && <div className="error">{error}</div>}

                    <button type="submit" disabled={loading}>
                        {loading
                            ? "Processing..."
                            : isLogin
                                ? "Sign In"
                                : "Create Account"}
                    </button>
                </form>

                <div className="switch">
                    {isLogin ? "New here?" : "Already have an account?"}{" "}
                    <span onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Create one" : "Sign in"}
                    </span>
                </div>
            </motion.div>

            <style>{`
        .auth-wrapper {
          position: relative;
          min-height: 100vh;
          background: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Inter, sans-serif;
          padding: 20px;
          overflow: hidden;
        }

        /* ------------------ BACKGROUND ANIMATION ------------------ */

        .bg-blobs {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 0;
        }

        .blob {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.6;
          animation: float 12s ease-in-out infinite;
        }

        .blob1 {
          background: #6366f1;
          top: -100px;
          left: -100px;
        }

        .blob2 {
          background: #22d3ee;
          bottom: -150px;
          right: -100px;
          animation-delay: 4s;
        }

        .blob3 {
          background: #f472b6;
          top: 50%;
          left: 60%;
          animation-delay: 8s;
        }

        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, -40px) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }

        /* ------------------ CARD ------------------ */

        .auth-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 50px 40px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.08);
          text-align: center;
        }

        .logo {
          font-size: 28px;
          margin-bottom: 20px;
        }

        h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        p {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 30px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        input {
          padding: 14px 16px;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          font-size: 14px;
          transition: 0.2s;
        }

        input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
          outline: none;
        }

        button {
          margin-top: 6px;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: #111827;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        button:hover {
          background: #1f2937;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          font-size: 13px;
          color: #dc2626;
          background: #fee2e2;
          padding: 10px;
          border-radius: 10px;
        }

        .switch {
          margin-top: 24px;
          font-size: 14px;
        }

        .switch span {
          font-weight: 600;
          color: #6366f1;
          cursor: pointer;
        }

        @media(max-width: 480px){
          .auth-card {
            padding: 35px 25px;
          }

          .blob {
            width: 250px;
            height: 250px;
          }
        }
      `}</style>
        </div>
    );
};

export default Auth;
