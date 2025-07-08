"use client";

import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { LucideBarChart2, LucidePieChart, LucideTrendingUp, LucideLink, LucideSearch, LucideAward, LucideActivity } from "lucide-react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-200 ${sidebarCollapsed ? "ml-16" : "ml-56"}`}>
        {/* Unified Topbar/Navbar */}
        <nav className="w-full flex items-center justify-between px-3 py-2 bg-white/90 backdrop-blur-md shadow-md z-20 border-b border-blue-100 sticky top-0 left-0 right-0" style={{ minHeight: '64px' }}>
          <div className="flex items-center gap-2">
            {/* <Image
              src="/IMSC I - 1 - logo.png"
              alt="i-MSConsulting Logo"
              width={56}
              height={56}
              priority
              className=""
              style={{ display: 'block', margin: 0, padding: 0 }}
            /> */}
            <div className="text-white text-xl font-bold" style={{ color: "#1d4ed8" }}>
              PickaTicket
            </div>
            {/* <span className="text-2xl font-bold text-blue-900 tracking-tight hidden sm:inline">i-MSConsulting</span> */}
          </div>
          <div className="flex items-center gap-4">
            {/* Search Field */}
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 shadow-sm"
              style={{ minWidth: '180px' }}
            />
            {/* Notification Bell */}
            <button className="relative p-2 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 shadow">3</span>
            </button>
            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/");
              }}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Logout
            </button>
          </div>
        </nav>
        {/* Main Content */}
        <div className="flex-1 px-4 py-8">
          {/* Top Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Tickets */}
            <div className="relative bg-white border border-blue-100 shadow rounded-xl p-6 flex flex-col justify-between min-h-[140px] hover:shadow-lg transition-all duration-200">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 rounded-t-xl" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-700">Total Tickets</span>
                <span className="bg-blue-50 p-2 rounded-lg flex items-center justify-center">
                  <LucideBarChart2 className="w-7 h-7 text-blue-500" />
                </span>
              </div>
              <div className="text-3xl font-bold text-blue-700 mb-1">128</div>
              <span className="text-xs text-gray-400 font-medium">All tickets in the system</span>
            </div>
            {/* Open Tickets */}
            <div className="relative bg-white border border-yellow-100 shadow rounded-xl p-6 flex flex-col justify-between min-h-[140px] hover:shadow-lg transition-all duration-200">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400 rounded-t-xl" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-700">Open Tickets</span>
                <span className="bg-yellow-50 p-2 rounded-lg flex items-center justify-center">
                  <LucidePieChart className="w-7 h-7 text-yellow-500" />
                </span>
              </div>
              <div className="text-3xl font-bold text-yellow-600 mb-1">34</div>
              <span className="text-xs text-gray-400 font-medium">Currently open</span>
            </div>
            {/* Resolved Tickets */}
            <div className="relative bg-white border border-green-100 shadow rounded-xl p-6 flex flex-col justify-between min-h-[140px] hover:shadow-lg transition-all duration-200">
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500 rounded-t-xl" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-700">Resolved Tickets</span>
                <span className="bg-green-50 p-2 rounded-lg flex items-center justify-center">
                  <LucideTrendingUp className="w-7 h-7 text-green-500" />
                </span>
              </div>
              <div className="text-3xl font-bold text-green-700 mb-1">81</div>
              <span className="text-xs text-gray-400 font-medium">Marked as resolved</span>
            </div>
            {/* Users */}
            <div className="relative bg-white border border-cyan-100 shadow rounded-xl p-6 flex flex-col justify-between min-h-[140px] hover:shadow-lg transition-all duration-200">
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 rounded-t-xl" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-700">Total Users</span>
                <span className="bg-cyan-50 p-2 rounded-lg flex items-center justify-center">
                  <LucideSearch className="w-7 h-7 text-cyan-500" />
                </span>
              </div>
              <div className="text-3xl font-bold text-cyan-700 mb-1">19</div>
              <span className="text-xs text-gray-400 font-medium">Registered users</span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Pie Chart */}
            <div className="bg-white border border-gray-100 shadow rounded-xl p-6 flex flex-col items-center">
              <h2 className="text-lg font-bold mb-4 text-gray-700">Ticket Status Distribution</h2>
              <svg width="220" height="220" viewBox="0 0 220 220">
                {/* Example Pie Chart: 4 segments */}
                <circle r="100" cx="110" cy="110" fill="#e5e7eb" />
                <path d="M110,110 L110,10 A100,100 0 0,1 210,110 Z" fill="#2563eb" />
                <path d="M110,110 L210,110 A100,100 0 0,1 110,210 Z" fill="#facc15" />
                <path d="M110,110 L110,210 A100,100 0 0,1 10,110 Z" fill="#22c55e" />
                <path d="M110,110 L10,110 A100,100 0 0,1 110,10 Z" fill="#f87171" />
              </svg>
              <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span> Open</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span> In Progress</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Resolved</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span> Closed</div>
              </div>
            </div>
            {/* Bar Chart */}
            <div className="bg-white border border-gray-100 shadow rounded-xl p-6 flex flex-col items-center">
              <h2 className="text-lg font-bold mb-4 text-gray-700">Tickets by Priority</h2>
              <svg width="260" height="180" viewBox="0 0 260 180">
                {/* Example Bar Chart: 3 bars */}
                <rect x="30" y="60" width="40" height="100" fill="#f87171" />
                <rect x="100" y="30" width="40" height="130" fill="#facc15" />
                <rect x="170" y="90" width="40" height="70" fill="#22c55e" />
                {/* Axis */}
                <line x1="20" y1="160" x2="240" y2="160" stroke="#d1d5db" strokeWidth="2" />
                <line x1="20" y1="20" x2="20" y2="160" stroke="#d1d5db" strokeWidth="2" />
                {/* Labels */}
                <text x="50" y="175" fontSize="14" fill="#6b7280">High</text>
                <text x="120" y="175" fontSize="14" fill="#6b7280">Medium</text>
                <text x="190" y="175" fontSize="14" fill="#6b7280">Low</text>
              </svg>
              <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-400 inline-block"></span> High</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-yellow-400 inline-block"></span> Medium</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-green-500 inline-block"></span> Low</div>
              </div>
            </div>
          </div>

          {/* Lower Section: More Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* High Priority Tickets */}
            <div className="relative bg-white border border-red-100 shadow rounded-xl p-6 flex flex-col justify-between min-h-[140px] hover:shadow-lg transition-all duration-200">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500 rounded-t-xl" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-700">High Priority</span>
                <span className="bg-red-50 p-2 rounded-lg flex items-center justify-center">
                  <LucideAward className="w-7 h-7 text-red-500" />
                </span>
              </div>
              <div className="text-3xl font-bold text-red-600 mb-1">7</div>
              <span className="text-xs text-gray-400 font-medium">Tickets marked as high</span>
            </div>
            {/* Support Staff */}
            <div className="relative bg-white border border-indigo-100 shadow rounded-xl p-6 flex flex-col justify-between min-h-[140px] hover:shadow-lg transition-all duration-200">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 rounded-t-xl" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-700">Support Staff</span>
                <span className="bg-indigo-50 p-2 rounded-lg flex items-center justify-center">
                  <LucideLink className="w-7 h-7 text-indigo-500" />
                </span>
              </div>
              <div className="text-3xl font-bold text-indigo-700 mb-1">5</div>
              <span className="text-xs text-gray-400 font-medium">Active support users</span>
            </div>
            {/* Recent Activity */}
            <div className="relative bg-white border border-fuchsia-100 shadow rounded-xl p-6 flex flex-col justify-between min-h-[140px] hover:shadow-lg transition-all duration-200">
              <div className="absolute top-0 left-0 w-full h-1 bg-fuchsia-500 rounded-t-xl" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-700">Recent Activity</span>
                <span className="bg-fuchsia-50 p-2 rounded-lg flex items-center justify-center">
                  <LucideActivity className="w-7 h-7 text-fuchsia-500" />
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <svg width="80" height="32" viewBox="0 0 80 32">
                  <polyline points="0,30 10,20 20,25 30,10 40,15 50,5 60,20 70,10 80,25" fill="none" stroke="#d946ef" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-xs text-gray-400 font-medium mt-2">Latest ticket updates</span>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="w-full bg-gradient-to-r from-blue-100 via-blue-400 to-gray-600 shadow-lg text-white py-2 text-center">
          <p>&copy; {new Date().getFullYear()} i-MSConsulting | All rights reserved. Designed by i-MSConsulting.</p>
        </div>
      </div>
    </div>
  );
}
