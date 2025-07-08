"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import NetflixIntro from "../components/NetflixIntro";
import { API_BASE_URL } from "./config";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
      // Hide the intro after the zoom animation completes
      setTimeout(() => {
        setShowIntro(false);
      }, 1000); // Add a small delay after the content appears
    }, 4200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
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
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', loggedInUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

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
    router.push("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {showIntro && <NetflixIntro />}
      <div className={`w-full min-h-screen flex items-center justify-center transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full max-w-[420px] p-8 mx-4 bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col items-center space-y-4">
            <img
              src="/IMSC I - 1 - logo.png"
              alt="Logo"
              className="w-20 h-20 object-contain"
            />
            <h2 className="text-2xl font-bold text-[#1a237e]">
              Login to Your Account
            </h2>
            <p className="text-gray-600 text-center text-sm">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#1a237e] focus:ring focus:ring-[#1a237e]/20 transition-colors duration-200"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#1a237e] focus:ring focus:ring-[#1a237e]/20 transition-colors duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
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
              className="w-full py-2.5 bg-[#1a237e] text-white font-medium rounded-lg shadow hover:bg-[#283593] transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a237e]"
            >
              Sign In
            </button>

            <div className="text-center">
              <span className="text-gray-600 text-sm">
                Don't have an account?{" "}
              </span>
              <button
                onClick={handleSignupRedirect}
                className="text-sm text-[#1a237e] hover:text-[#283593] font-medium hover:underline focus:outline-none transition-colors duration-200"
              >
                Create an account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
