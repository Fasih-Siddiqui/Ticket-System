import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, Ticket, User, LucideTicket } from "lucide-react";
import { LucideHome } from "lucide-react";

export default function EmployeeSidebar({ open, setOpen, onLogout }) {
  const router = useRouter();
  // open and setOpen are now controlled from parent for responsiveness

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) {
      onLogout();
    } else {
      router.push("/");
    }
  };

  const navItems = [
    {
      href: "/dashboard-employee/home",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      href: "/dashboard-employee",
      label: "Ticket",
      icon: <LucideTicket className="w-5 h-5" />,
    },
    // {
    //   href: "/tickets",
    //   label: "My Tickets",
    //   icon: <Ticket className="w-5 h-5" />,
    // },
    {
      href: "/dashboard-employee/users",
      label: "Users",
      icon: <User className="w-5 h-5" />,
    },
    // {
    //   href: "/dashboard-employee/profile",
    //   label: "Profile",
    //   icon: <User className="w-5 h-5" />,
    // },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full min-h-screen bg-gradient-to-b from-blue-100 via-blue-400 to-gray-600 shadow-lg flex flex-col justify-between transition-all duration-300 z-40
        ${open ? "w-60" : "w-16"}
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      style={{
        // On mobile, overlay the sidebar
        width: open ? 240 : 64,
      }}
    >
      {/* Sidebar Header with Toggle */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-blue-200">
        <span
          className={`text-lg font-bold text-white transition-all duration-200 ${
            open ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
          }`}
        >
          Menu
        </span>
        <button
          className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none md:block"
          onClick={() => setOpen && setOpen((prev) => !prev)}
          aria-label={open ? "Close sidebar" : "Open sidebar"}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 px-2 pt-6">
        {navItems.map((item) => (
          <Link href={item.href} passHref legacyBehavior key={item.href}>
            <a className={`flex items-center gap-3 py-2 px-2 rounded-md text-white hover:bg-blue-500 transition-all ${open ? "justify-start" : "justify-center"}`}>
              {item.icon}
              <span className={`transition-all duration-200 ${open ? "opacity-100 ml-2" : "opacity-0 w-0 overflow-hidden"}`}>{item.label}</span>
            </a>
          </Link>
        ))}
      </nav>
      {/* Logout Button */}
      <div className="px-2 py-6">
        <Button onClick={handleLogout} className={`w-full bg-white text-gray-700 font-semibold hover:bg-gray-100 flex items-center justify-center gap-2 ${open ? "px-4" : "px-2"}`}>
          <X className="w-5 h-5" />
          <span className={`transition-all duration-200 ${open ? "opacity-100 ml-2" : "opacity-0 w-0 overflow-hidden"}`}>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
