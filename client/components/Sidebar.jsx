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
  // { href: "/home", icon: LucideLayoutDashboard, label: "Home" },
  { href: "/home", icon: LucideLayoutDashboard, label: "Dashboard" },
  { href: "/dashboard-admin", icon: LucideTicket, label: "Tickets" },
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
          {collapsed ? <Menu className="w-7 h-7 text-gray-500" /> : <ChevronLeft className="w-7 h-7 text-gray-500" />}
        </button>
      </div>
      <nav className="flex-1 py-6 px-1 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-0 md:gap-3 px-2 py-2 rounded-lg hover:bg-gray-200 hover:text-blue-700 transition-colors group ${collapsed ? 'justify-center' : 'justify-start'}`}
            style={{ minHeight: 44 }}
          >
            <span className="flex items-center justify-center w-10 h-10">
              <Icon className="w-6 h-6  text-gray-500 group-hover:text-blue-700 transition-colors block flex-shrink-0 leading-none align-middle" />
            </span>
            <span
              className={`ml-1 text-[15px] font-semibold group-hover:text-blue-700 transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
              style={{ maxWidth: collapsed ? 0 : 140 }}
            >
              {label}
            </span>
          </Link>
        ))}
      </nav>
      <div className="p-1 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-2 py-2 rounded-lg hover:bg-gray-200 hover:text-blue-700 transition-colors text-left"
          style={{ minHeight: 44 }}
        >
          <span className="flex items-center justify-center w-10 h-10">
            <LucideLogOut className="w-6 h-6 text-gray-500 group-hover:text-blue-700 transition-colors block flex-shrink-0 leading-none align-middle" />
          </span>
          <span
            className={`font-semibold transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
            style={{ maxWidth: collapsed ? 0 : 140 }}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
