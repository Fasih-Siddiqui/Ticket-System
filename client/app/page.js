"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoginGif from "./components/loginGif";
import { API_BASE_URL } from "./config";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [animations, setAnimations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getRandomPercentage = () => Math.floor(Math.random() * 120);

    const usedPositions = new Set();
    const newAnimations = [];

    const generateUniquePosition = () => {
      let top, left;
      do {
        top = `${getRandomPercentage()}%`;
        left = `${getRandomPercentage()}%`;
      } while (usedPositions.has(`${top},${left}`));

      usedPositions.add(`${top},${left}`);
      return { top, left };
    };

    for (let i = 0; i < 20; i++) {
      const { top, left } = generateUniquePosition();
      newAnimations.push({ top, left });
    }

    setAnimations(newAnimations);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Client-side validation
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        username: username.trim(),
        password,
      }, {
        withCredentials: true
      });

      const { token, role, username: loggedInUser } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', loggedInUser);

      // Configure axios defaults for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redirect based on role
      if (role === "admin") {
        router.push("/dashboard-admin");
      } else if (role === "support") {
        router.push("/dashboard-support");
      } else if (role === "user") {
        router.push("/dashboard-employee");
      } else {
        console.log("Unknown role:", role);
        setError("Invalid user role");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.error || "An error occurred during login");
    }
  };

  const handleSignupRedirect = () => {
    router.push("/signup"); // Replace with your actual signup page route
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-2xl p-8 md:p-10 flex flex-col items-center z-10 relative animate-fade-in">
        <img
          src="/IMSC I - 1 - logo.png"
          alt="Logo"
          className="w-50 h-20 mb-2"
        />
        <h2 className="text-3xl font-bold text-blue-900 mb-2 mt-2 text-center tracking-tight">
          Login to Your Account
        </h2>
        <p className="text-gray-500 mb-6 text-center text-base">
          Enter your credentials to access your dashboard.
        </p>
        <form onSubmit={handleSubmit} className="w-full space-y-5" autoComplete="off">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-50"
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-2 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 duration-300 font-semibold text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600 text-sm">
            Don't have an account?{" "}
          </span>
          <button
            onClick={handleSignupRedirect}
            className="text-sm text-blue-700 hover:underline focus:outline-none font-medium"
          >
            Create an account
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 1.2s cubic-bezier(0.4,0,0.2,1) both; }
      `}</style>
    </div>
  );
}
