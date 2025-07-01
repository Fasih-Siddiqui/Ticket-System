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
