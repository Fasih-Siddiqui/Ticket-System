"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideBarChart2, LucidePieChart, LucideTrendingUp, LucideUser, LucideActivity } from "lucide-react";
import EmployeeSidebar from "@/components/EmployeeSidebar";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useRouter } from "next/navigation";

export default function EmployeeHome() {
  // Responsive sidebar state for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  // Fetch user from token if available (copy logic from dashboard page)
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decodedToken = JSON.parse(jsonPayload);
        setUserData(decodedToken);
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // Example stats, replace with real data as needed
  const stats = [
    {
      label: "Total Tickets",
      value: 128,
      color: "from-blue-400 to-blue-600",
      icon: <LucideBarChart2 className="w-8 h-8 text-blue-600" />,
      border: "border-blue-200",
      bg: "bg-blue-200",
    },
    {
      label: "Open Tickets",
      value: 34,
      color: "from-yellow-400 to-yellow-600",
      icon: <LucidePieChart className="w-8 h-8 text-yellow-500" />,
      border: "border-yellow-200",
      bg: "bg-yellow-50",
    },
    {
      label: "Resolved Tickets",
      value: 81,
      color: "from-green-400 to-green-600",
      icon: <LucideTrendingUp className="w-8 h-8 text-green-600" />,
      border: "border-green-200",
      bg: "bg-green-50",
    },
    {
      label: "My Profile",
      value: "View",
      color: "from-cyan-400 to-cyan-600",
      icon: <LucideUser className="w-8 h-8 text-cyan-600" />,
      border: "border-cyan-200",
      bg: "bg-cyan-50",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <EmployeeSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <DashboardNavbar user={userData} onLogout={handleLogout} sidebarOpen={sidebarOpen} />
      {/* Mobile sidebar toggle button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white shadow-lg md:hidden"
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      {/* Main Content Area */}
      <main
        className={`flex-1 flex flex-col min-h-screen pt-[88px] p-4 md:p-6 transition-all duration-300 w-full
          ${sidebarOpen ? 'md:ml-60 ml-0' : 'md:ml-16 ml-0'}
        `}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Employee Home</h1>
          <p className="text-gray-500">Welcome to your dashboard. Here are your quick stats and activity graphs.</p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {stats.map((stat, idx) => (
            <Card
              key={idx}
              className={`shadow-lg border-0 bg-gradient-to-br ${stat.color} text-white hover:shadow-xl transition-all relative overflow-hidden`}
            >
              <CardContent className="p-4 md:p-6 flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-semibold drop-shadow-lg">{stat.label}</span>
                  <span className="p-2 rounded-lg flex items-center justify-center bg-white bg-opacity-20 drop-shadow-lg">{stat.icon}</span>
                </div>
                <div className="text-3xl font-bold mb-1 drop-shadow-lg">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Graphs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Pie Chart Example */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col items-center w-full min-h-[400px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Ticket Status Distribution</h2>
            {/* SVG Pie Chart - Larger and with more space for legend */}
            <div className="flex flex-col items-center w-full">
              <svg width="320" height="320" viewBox="0 0 320 320" className="mx-auto block">
                <circle cx="160" cy="160" r="145" fill="#f1f5f9" />
                {/* Open - Blue */}
                <path d="M160,160 L160,25 A135,135 0 0,1 295,160 Z" fill="#38bdf8" />
                {/* Resolved - Green */}
                <path d="M160,160 L295,160 A135,135 0 0,1 160,295 Z" fill="#34d399" />
                {/* Other - Yellow */}
                <path d="M160,160 L160,295 A135,135 0 0,1 25,160 Z" fill="#facc15" />
                {/* Closed - Red */}
                <path d="M160,160 L25,160 A135,135 0 0,1 160,25 Z" fill="#f87171" />
                {/* Center circle for donut effect */}
                <circle cx="160" cy="160" r="90" fill="#fff" />
              </svg>
              {/* Legend below chart */}
              <div className="flex flex-wrap justify-center gap-6 mt-4">
                <div className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-[#38bdf8]"></span><span className="text-gray-600 text-sm">Open</span></div>
                <div className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-[#34d399]"></span><span className="text-gray-600 text-sm">Resolved</span></div>
                <div className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-[#facc15]"></span><span className="text-gray-600 text-sm">Other</span></div>
                <div className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-[#f87171]"></span><span className="text-gray-600 text-sm">Closed</span></div>
              </div>
            </div>
          </div>
          {/* Bar Chart Example */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col items-center w-full min-h-[400px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Tickets by Month</h2>
            {/* SVG Bar Chart - Larger and more space */}
            <svg width="340" height="260" viewBox="0 0 340 220" className="mx-auto block">
              <rect x="40" y="120" width="40" height="80" fill="#38bdf8" rx="12" />
              <rect x="90" y="60" width="40" height="140" fill="#facc15" rx="12" />
              <rect x="140" y="30" width="40" height="170" fill="#22d3ee" rx="12" />
              <rect x="190" y="180" width="40" height="20" fill="#34d399" rx="12" />
              <rect x="240" y="90" width="40" height="110" fill="#f87171" rx="12" />
              {/* Bar labels */}
              <text x="60" y="215" textAnchor="middle" fill="#64748b" fontSize="18">Jan</text>
              <text x="110" y="215" textAnchor="middle" fill="#64748b" fontSize="18">Feb</text>
              <text x="160" y="215" textAnchor="middle" fill="#64748b" fontSize="18">Mar</text>
              <text x="210" y="215" textAnchor="middle" fill="#64748b" fontSize="18">Apr</text>
              <text x="260" y="215" textAnchor="middle" fill="#64748b" fontSize="18">May</text>
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
}
