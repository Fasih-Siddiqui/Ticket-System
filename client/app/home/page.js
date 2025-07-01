"use client";

import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { LucideBarChart2, LucidePieChart, LucideTrendingUp, LucideLink, LucideSearch, LucideAward, LucideActivity } from "lucide-react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen">
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
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg p-6 flex flex-col justify-between min-h-[150px] border-b-4 border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-white">Total Tickets</span>
                <LucideBarChart2 className="w-7 h-7 text-blue-200" />
              </div>
              <div className="text-4xl font-extrabold text-white mb-1">128</div>
              <span className="text-sm text-blue-200">All tickets in the system</span>
            </div>
            {/* Open Tickets */}
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg p-6 flex flex-col justify-between min-h-[150px] border-b-4 border-yellow-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-white">Open Tickets</span>
                <LucidePieChart className="w-7 h-7 text-yellow-200" />
              </div>
              <div className="text-4xl font-extrabold text-white mb-1">34</div>
              <span className="text-sm text-yellow-100">Currently open</span>
            </div>
            {/* Resolved Tickets */}
            <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl shadow-lg p-6 flex flex-col justify-between min-h-[150px] border-b-4 border-green-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-white">Resolved Tickets</span>
                <LucideTrendingUp className="w-7 h-7 text-green-200" />
              </div>
              <div className="text-4xl font-extrabold text-white mb-1">81</div>
              <span className="text-sm text-green-100">Marked as resolved</span>
            </div>
            {/* Users */}
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-2xl shadow-lg p-6 flex flex-col justify-between min-h-[150px] border-b-4 border-cyan-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-white">Total Users</span>
                <LucideSearch className="w-7 h-7 text-cyan-200" />
              </div>
              <div className="text-4xl font-extrabold text-white mb-1">19</div>
              <span className="text-sm text-cyan-100">Registered users</span>
            </div>
          </div>

          {/* Lower Section: More Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* High Priority Tickets */}
            <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl shadow-lg p-6 flex flex-col justify-between min-h-[150px] border-b-4 border-red-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-white">High Priority</span>
                <LucideAward className="w-7 h-7 text-red-200" />
              </div>
              <div className="text-4xl font-extrabold text-white mb-1">7</div>
              <span className="text-sm text-red-100">Tickets marked as high</span>
            </div>
            {/* Support Staff */}
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg p-6 flex flex-col justify-between min-h-[150px] border-b-4 border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-white">Support Staff</span>
                <LucideLink className="w-7 h-7 text-blue-200" />
              </div>
              <div className="text-4xl font-extrabold text-white mb-1">5</div>
              <span className="text-sm text-blue-100">Active support users</span>
            </div>
            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl shadow-lg p-6 flex flex-col justify-between min-h-[150px] border-b-4 border-indigo-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-white">Recent Activity</span>
                <LucideActivity className="w-7 h-7 text-indigo-200" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <svg width="80" height="32" viewBox="0 0 80 32">
                  <polyline points="0,30 10,20 20,25 30,10 40,15 50,5 60,20 70,10 80,25" fill="none" stroke="#c7d2fe" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-sm text-indigo-100 mt-2">Latest ticket updates</span>
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
