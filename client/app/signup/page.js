"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

export default function Signup() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLoginRedirect = () => {
    router.push("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fullname === "" || email === "" || username === "" || password === "") {
      alert("Error: Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/api/signup", {
        fullname: fullname,
        email: email,
        username: username,
        password: password,
      });

      console.log("Signup response:", response.data);
      alert("Signup successful!");

      // Redirect to login page or any other page as needed
      router.push("/"); // Example redirect to login page
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed");
    }
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
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Signup
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullname" className="block text-gray-700">
              Full Name
            </label>
            <input
              id="fullname"
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              placeholder="Enter your full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-gray-700">
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
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-800 duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Sign Up
          </button>
          <div className ="mt-2 text-center" >
          <button
            type="button"
            onClick={handleLoginRedirect}
            className="text-sm text-blue-600 hover:underline focus:outline-none "
          >
            Login
          </button>

          </div>
        </form>
      </div>
    </div>
  );
}
