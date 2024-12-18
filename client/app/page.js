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
    if (username === "" || password === "") {
      alert("Error: Please fill in both fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/api/login", {
        username,
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
      } else if (role == "support" || role == 'SUPPORT') {
        router.push("/dashboard-support");
      } else if (role == "user") {
        router.push("/dashboard-employee");
      } else {
        console.log("Unknown role:", role);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.error || "An error occurred during login"
      );
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
      <div className="bg-white border border-black shadow-lg shadow-blue-700 p-8 rounded-lg w-full max-w-md relative z-10">
        <img 
          src="/logo.png"
          alt="i-MS Logo"
          className="mb-5"
          />

        {/* <h2 className="text-2xl font-bold mb-6 text-center mt-5"
        style={{ color: "#145388" }}>
          Ticket System
        </h2> */}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="text" className="block text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between ">
            <div className="flex items-center mt-8">
              <input
                id="remember"
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <label htmlFor="remember" className="ml-2 text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:underline mt-8">
              Forgot password?
            </a>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Login
            </button>
          </div>
          <div className="mt-2 text-center">
            <button
              type="button"
              onClick={handleSignupRedirect}
              className="text-sm text-blue-600 hover:underline focus:outline-none"
            >
              Create a new account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
