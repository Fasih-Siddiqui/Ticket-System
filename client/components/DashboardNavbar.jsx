import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// IMPORTANT: To display this navbar correctly, ensure your main content has top padding or margin of at least 64px (or 88px if you want more space).
// Example: <main className="pt-[64px]"> ... </main>
export default function DashboardNavbar({ user, onLogout, sidebarOpen }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  return (
    <>
      <nav
        className="w-full flex items-center justify-between px-3 py-0 bg-white/90 backdrop-blur-md shadow-lg z-30 border-b border-blue-100 fixed top-0 left-0 right-0"
        style={{
          minHeight: "64px",
          marginLeft:
            typeof window !== "undefined" && window.innerWidth >= 768
              ? sidebarOpen
                ? 240
                : 64
              : 0,
        }}
      >
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
          <div
            className="text-white text-xl font-bold"
            style={{ color: "#1d4ed8" }}
          >
            PickaTicket
          </div>
        </div>
        <div className="flex flex-col items-center justify-center ">
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome {user?.fullname || user?.name || "User"}
          </h1>
          <p className="mt-1 text-sm text-gray-400">Admin Portal</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Search Field */}
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 shadow-sm"
            style={{ minWidth: "180px" }}
          />
          {/* Notification Bell */}
          <button className="relative p-2 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <svg
              className="w-7 h-7 text-blue-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 shadow">
              3
            </span>
          </button>
          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="pt-[64px]">
        {/* Your page content here */}
      </main>
    </>
  );
}
