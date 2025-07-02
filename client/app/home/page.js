"use client";

import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { LucideBarChart2, LucidePieChart, LucideTrendingUp, LucideLink, LucideSearch, LucideAward, LucideActivity } from "lucide-react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-200 ${sidebarCollapsed ? "ml-16" : "ml-56"}`}>
        {/* Top Nav Bar */}
        <div className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 shadow-sm border-b border-gray-200">
          <div className="mx-2 py-0.5">
            <div className="grid grid-cols-3 items-center">
              <div className="flex items-center ml-1">
                <Image src="/logo.png" alt="i-MSConsulting Logo" width={220} height={200} priority className="p-0 m-0" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-700 leading-tight font-sans tracking-tight drop-shadow-sm">
                  Dashboard Overview
                </h1>
              </div>
              {/* <div className="flex items-center justify-end space-x-2">
                <Button className="bg-white text-gray-700 font-semibold hover:bg-gray-100">Login</Button>
                <Button className="bg-blue-600 text-white font-semibold hover:bg-blue-700">Sign Up</Button>
              </div> */}
            </div>
          </div>
        </div>
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
