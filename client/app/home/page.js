"use client";

import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { LucideBarChart2, LucidePieChart, LucideTrendingUp, LucideLink, LucideSearch, LucideAward, LucideActivity, Router, User } from "lucide-react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-200 ${sidebarCollapsed ? "ml-16" : "ml-56"}`}>
        {/* Unified Topbar/Navbar */}
        <nav className="w-full flex items-center justify-between px-3 py-0 bg-white/90 backdrop-blur-md shadow-md z-20 border-b border-blue-100 sticky top-0 left-0 right-0" style={{ minHeight: '64px' }}>
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
          </div>
            {/* Center: Welcome Text */}
  <div className="text-xl font-semibold text-gray-800">
    {/* Welcome to Dashboard */}
  {/* </div> */}
          <div className="flex flex-col items-center justify-center ">
            {/* <h1 className="text-2xl font-semibold text-black-500"> */}
             <h1> Welcome
              Fasih uddin Siddiqui
            </h1>
            <p class="mt-1 text-sm text-gray-400">Admin Portal</p>
          </div>
          <div className="flex justify-end">
            {/* <span className="text-2xl font-bold text-blue-900 tracking-tight hidden sm:inline">i-MSConsulting</span> */}
          </div>
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
            <div className="relative shadow-lg rounded-2xl p-6 flex flex-col justify-between min-h-[140px] hover:shadow-xl transition-all duration-200 overflow-hidden"
              style={{
                background: 'white',
                border: '1px solid #bfdbfe',
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 rounded-t-2xl" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-blue-900">Total Tickets</span>
                <span className="bg-blue-100 p-2 rounded-lg flex items-center justify-center">
                  <LucideBarChart2 className="w-7 h-7 text-blue-600" />
                </span>
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-1">128</div>
              <span className="text-xs text-blue-700 font-medium">All tickets in the system</span>
            </div>
            {/* Open Tickets */}
            <div className="relative shadow-lg rounded-2xl p-6 flex flex-col justify-between min-h-[140px] hover:shadow-xl transition-all duration-200 overflow-hidden"
              style={{
                background: 'white',
                border: '1px solid #fde68a',
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400 rounded-t-2xl" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-yellow-900">Open Tickets</span>
                <span className="bg-yellow-100 p-2 rounded-lg flex items-center justify-center">
                  <LucidePieChart className="w-7 h-7 text-yellow-500" />
                </span>
              </div>
              <div className="text-3xl font-bold text-yellow-900 mb-1">34</div>
              <span className="text-xs text-yellow-700 font-medium">Currently open</span>
            </div>
            {/* Resolved Tickets */}
            <div className="relative shadow-lg rounded-2xl p-6 flex flex-col justify-between min-h-[140px] hover:shadow-xl transition-all duration-200 overflow-hidden"
              style={{
                background: 'white',
                border: '1px solid #6ee7b7',
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-green-400 rounded-t-2xl" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-green-900">Resolved Tickets</span>
                <span className="bg-green-100 p-2 rounded-lg flex items-center justify-center">
                  <LucideTrendingUp className="w-7 h-7 text-green-500" />
                </span>
              </div>
              <div className="text-3xl font-bold text-green-900 mb-1">81</div>
              <span className="text-xs text-green-700 font-medium">Marked as resolved</span>
            </div>
            {/* Users */}
            <div className="relative shadow-lg rounded-2xl p-6 flex flex-col justify-between min-h-[140px] hover:shadow-xl transition-all duration-200 overflow-hidden"
              style={{
                background: 'white',
                border: '1px solid #67e8f9',
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 rounded-t-2xl" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-cyan-900">Total Users</span>
                <span className="bg-cyan-100 p-2 rounded-lg flex items-center justify-center">
                  <LucideSearch className="w-7 h-7 text-cyan-500" />
                </span>
              </div>
              <div className="text-3xl font-bold text-cyan-900 mb-1">19</div>
              <span className="text-xs text-cyan-700 font-medium">Registered users</span>
            </div>
          </div>
          {/* Lower Section: More Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* High Priority Tickets */}
            <div className="relative shadow-lg rounded-xl p-6 flex flex-col justify-between min-h-[140px] hover:shadow-lg transition-all duration-200 overflow-hidden"
              style={{
                background: 'white',
                border: '1px solid #fecaca',
              }}
            >
              {/* Pattern overlay: LucideAward icon as a light pattern */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" width="100%" height="100%" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="icon-award" width="48" height="48" patternUnits="userSpaceOnUse">
                    <g opacity="0.12">
                      <rect x="0" y="0" width="48" height="48" fill="none" />
                      <circle cx="24" cy="20" r="10" stroke="#ef4444" strokeWidth="3" fill="#fee2e2" />
                      <rect x="20" y="32" width="8" height="12" rx="2" fill="#ef4444" />
                    </g>
                  </pattern>
                </defs>
                <rect width="200" height="140" fill="url(#icon-award)" />
              </svg>
              <div className="absolute top-0 left-0 w-full h-1 bg-red-300 rounded-t-xl" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-red-900">High Priority</span>
                <span className="bg-red-50 p-2 rounded-lg flex items-center justify-center">
                  <LucideAward className="w-7 h-7 text-red-500" />
                </span>
              </div>
              <div className="text-3xl font-bold text-red-900 mb-1">7</div>
              <span className="text-xs text-red-700 font-medium">Tickets marked as high</span>
            </div>
            {/* Support Staff */}
            <div className="relative shadow-lg rounded-xl p-6 flex flex-col justify-between min-h-[140px] hover:shadow-lg transition-all duration-200 overflow-hidden"
              style={{
                background: 'white',
                border: '1px solid #c7d2fe',
              }}
            >
              {/* Pattern overlay: LucideLink icon as a light pattern */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" width="100%" height="100%" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="icon-link" width="48" height="48" patternUnits="userSpaceOnUse">
                    <g opacity="0.12">
                      <rect x="0" y="0" width="48" height="48" fill="none" />
                      <rect x="10" y="22" width="28" height="4" rx="2" fill="#6366f1" />
                      <rect x="22" y="10" width="4" height="28" rx="2" fill="#6366f1" />
                    </g>
                  </pattern>
                </defs>
                <rect width="200" height="140" fill="url(#icon-link)" />
              </svg>
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-300 rounded-t-xl" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-indigo-900">Support Staff</span>
                <span className="bg-indigo-50 p-2 rounded-lg flex items-center justify-center">
                  <LucideLink className="w-7 h-7 text-indigo-500" />
                </span>
              </div>
              <div className="text-3xl font-bold text-indigo-900 mb-1">5</div>
              <span className="text-xs text-indigo-700 font-medium">Active support users</span>
            </div>
            {/* Recent Activity */}
            <div className="relative shadow-lg rounded-xl p-6 flex flex-col justify-between min-h-[140px] hover:shadow-lg transition-all duration-200 overflow-hidden"
              style={{
                background: 'white',
                border: '1px solid #f0abfc',
              }}
            >
              {/* Pattern overlay: LucideActivity icon as a light pattern */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" width="100%" height="100%" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="icon-activity" width="48" height="48" patternUnits="userSpaceOnUse">
                    <g opacity="0.12">
                      <rect x="0" y="0" width="48" height="48" fill="none" />
                      <polyline points="4,44 16,32 24,40 44,8" stroke="#d946ef" strokeWidth="4" fill="none" />
                      <circle cx="4" cy="44" r="2.5" fill="#d946ef" />
                      <circle cx="16" cy="32" r="2.5" fill="#d946ef" />
                      <circle cx="24" cy="40" r="2.5" fill="#d946ef" />
                      <circle cx="44" cy="8" r="2.5" fill="#d946ef" />
                    </g>
                  </pattern>
                </defs>
                <rect width="200" height="140" fill="url(#icon-activity)" />
              </svg>
              <div className="absolute top-0 left-0 w-full h-1 bg-fuchsia-300 rounded-t-xl" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-fuchsia-900">Recent Activity</span>
                <span className="bg-fuchsia-50 p-2 rounded-lg flex items-center justify-center">
                  <LucideActivity className="w-7 h-7 text-fuchsia-500" />
                </span>

              </div>
              <div className="flex-1 flex items-center justify-center">
                <svg width="80" height="32" viewBox="0 0 80 32">
                  <polyline points="0,30 10,20 20,25 30,10 40,15 50,5 60,20 70,10 80,25" fill="none" stroke="#d946ef" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-xs text-fuchsia-700 font-medium mt-2">Latest ticket updates</span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6
           mb-8">

            {/* Pie Chart */}
            <div className="relative shadow-lg rounded-xl p-6 flex flex-col items-center overflow-hidden"
              style={{
                background: 'white',
                border: '1px solid #cbd5e1',
              }}
            >
              {/* Pattern overlay: Pie chart icon as a light pattern */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" width="100%" height="100%" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="icon-piechart-bg" width="80" height="80" patternUnits="userSpaceOnUse">
                    <g opacity="0.10">
                      <circle cx="40" cy="40" r="32" stroke="#3b82f6" strokeWidth="8" fill="#fef9c3" />
                      <path d="M40 40 L40 8 A32 32 0 0 1 72 40 Z" fill="#3b82f6" />
                    </g>
                  </pattern>
                </defs>
                <rect width="220" height="220" fill="url(#icon-piechart-bg)" />
              </svg>
              <h2 className="text-lg font-bold mb-4 text-gray-700 relative z-10">Ticket Status Distribution</h2>
              <svg width="220" height="220" viewBox="0 0 220 220" className="relative z-10">
                {/* Example Pie Chart: 4 segments */}
                <circle r="100" cx="110" cy="110" fill="#e5e7eb" />
                <path d="M110,110 L110,10 A100,100 0 0,1 210,110 Z" fill="#3b82f6" />
                <path d="M110,110 L210,110 A100,100 0 0,1 110,210 Z" fill="#fde047" />
                <path d="M110,110 L110,210 A100,100 0 0,1 10,110 Z" fill="#22c55e" />
                <path d="M110,110 L10,110 A100,100 0 0,1 110,10 Z" fill="#ef4444" />
              </svg>
              <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm relative z-10">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span> Open</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span> In Progress</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Resolved</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span> Closed</div>
              </div>
            </div>
            {/* Bar Chart */}
            <div className="relative shadow-lg rounded-xl p-6 flex flex-col items-center overflow-hidden"
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
              }}
            >
              {/* Pattern overlay: Bar chart icon as a light pattern */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" width="100%" height="100%" viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="icon-barchart-bg" width="100" height="80" patternUnits="userSpaceOnUse">
                    <g opacity="0.10">
                      <rect x="0" y="0" width="100" height="80" fill="none" />
                      <rect x="10" y="40" width="20" height="30" rx="6" fill="#f87171" />
                      <rect x="40" y="20" width="20" height="50" rx="6" fill="#facc15" />
                      <rect x="70" y="10" width="20" height="60" rx="6" fill="#22c55e" />
                    </g>
                  </pattern>
                </defs>
                <rect width="260" height="180" fill="url(#icon-barchart-bg)" />
              </svg>
              <h2 className="text-lg font-bold mb-4 text-gray-700 relative z-10">Tickets by Priority</h2>
              <svg width="260" height="180" viewBox="0 0 260 180" className="relative z-10">
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
              <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm relative z-10">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-400 inline-block"></span> High</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-yellow-400 inline-block"></span> Medium</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-green-500 inline-block"></span> Low</div>
              </div>
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