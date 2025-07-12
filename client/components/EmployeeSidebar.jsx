
import React from "react";
import Link from "next/link";
import {
  LucideTicket,
  LucideUserCheck,
  LucideLogOut,
  LucideLayoutDashboard,
  Menu,
  ChevronLeft
} from "lucide-react";

const navItems = [
  { href: "/dashboard-employee/home", icon: LucideLayoutDashboard, label: "Dashboard" },
  { href: "/dashboard-employee", icon: LucideTicket, label: "Tickets" },
  { href: "/dashboard-employee/users", icon: LucideUserCheck, label: "Users" },
];

export default function EmployeeSidebar({ onLogout, collapsed, setCollapsed }) {
  let currentPath = '';
  if (typeof window !== 'undefined') {
    currentPath = window.location.pathname;
  }
  return (
    <aside
      className={`h-full bg-gray-100 text-gray-800 shadow-sm flex flex-col fixed top-0 left-0 z-30 transition-all duration-200 border-r border-gray-300 ${collapsed ? "w-16" : "w-56"}`}
    >
      <div className={`flex items-center h-16 border-b border-gray-200 bg-white/80 ${collapsed ? 'justify-center' : 'justify-end pr-4'}`}>
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu className="w-6 h-6 text-blue-500" /> : <ChevronLeft className="w-6 h-6 text-blue-500" />}
        </button>
      </div>
      {/* Navigation */}
      <nav className="flex-1 py-6 px-0 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = currentPath === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-0 md:gap-3 pl-4 pr-2 py-2 rounded-lg transition-all group font-medium text-base ${collapsed ? 'justify-center pl-0 pr-0' : 'justify-start'} ${isActive ? 'bg-white/90 text-blue-700 shadow-inner' : 'hover:bg-white/70 hover:text-blue-700'}`}
              style={{ minHeight: 44 }}
            >
              <span className="flex items-center justify-center w-12 h-12">
                <Icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-400'} group-hover:text-blue-700 transition-colors block flex-shrink-0 leading-none align-middle`} />
              </span>
              <span
                className={`ml-1 text-[15px] font-semibold transition-all duration-200 overflow-hidden whitespace-nowrap ${isActive ? 'text-blue-700' : 'text-gray-400'} group-hover:text-blue-700 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
                style={{ maxWidth: collapsed ? 0 : 140 }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
      {/* Logout */}
      <div className="p-2 border-t border-gray-200 bg-white/80">
        <button
          onClick={() => {
            if (typeof onLogout === 'function') {
              onLogout();
            } else {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/';
              }
            }
          }}
          className="flex items-center gap-2 w-full px-2 py-2 rounded-lg transition-all text-left font-semibold bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{ minHeight: 44 }}
        >
          <span className="flex items-center justify-center w-10 h-10">
            <LucideLogOut className="w-6 h-6 text-white" />
          </span>
          <span
            className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
            style={{ maxWidth: collapsed ? 0 : 140 }}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
