import React, { useState } from "react";
import Link from "next/link";
import {
  LucideTicket,
  LucideUserCheck,
  LucideSettings,
  LucideLogOut,
  LucideLayoutDashboard,
  Menu,
  ChevronLeft
} from "lucide-react";

const navItems = [
  { href: "/dashboard-admin", icon: LucideLayoutDashboard, label: "Dashboard" },
  { href: "/tickets", icon: LucideTicket, label: "Tickets" },
  { href: "/users", icon: LucideUserCheck, label: "Users" },
  { href: "/settings", icon: LucideSettings, label: "Settings" },
];

export default function Sidebar({ onLogout, collapsed, setCollapsed }) {
  return (
    <aside
      className={`h-full bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-800 shadow-lg flex flex-col fixed top-0 left-0 z-30 transition-all duration-200 border-r border-gray-300 ${collapsed ? "w-16" : "w-56"}`}
    >
      <div className="flex items-center justify-end h-16 px-2 border-b border-gray-200">
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-2 rounded hover:bg-gray-300 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu className="w-6 h-6 text-gray-500" /> : <ChevronLeft className="w-6 h-6 text-gray-500" />}
        </button>
      </div>
      <nav className="flex-1 py-6 px-2 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-center md:justify-start gap-0 md:gap-3 px-2 py-2 rounded-lg hover:bg-gray-200 hover:text-blue-700 transition-colors group"
          >
            <span className="flex items-center justify-center w-8 h-8">
              <Icon className="w-5 h-5 text-gray-500 group-hover:text-blue-700" />
            </span>
            <span
              className={`ml-2 text-base font-medium group-hover:text-blue-700 transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
              style={{ maxWidth: collapsed ? 0 : 160 }}
            >
              {label}
            </span>
          </Link>
        ))}
      </nav>
      <div className="p-2 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-2 py-2 rounded-lg hover:bg-gray-200 hover:text-blue-700 transition-colors text-left"
        >
          <span className="flex items-center justify-center w-8 h-8">
            <LucideLogOut className="w-5 h-5 text-gray-500 group-hover:text-blue-700" />
          </span>
          <span
            className={`font-medium transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
            style={{ maxWidth: collapsed ? 0 : 160 }}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
