"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoginGif from "./components/loginGif";

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
      const response = await axios.post("http://localhost:8081/api/login", {
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
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-100"
      style={{
        backgroundImage: "url('/bg-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {animations.length > 0 &&
          animations.map((animation, index) => (
            <div
              key={index}
              className="absolute animate-bubble"
              style={{ top: animation.top, left: animation.left }}
            ></div>
          ))}
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-96 relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
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
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={handleSignupRedirect}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}
