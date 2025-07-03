import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function DashboardNavbar({ user, onLogout, sidebarOpen }) {
  // Sidebar width: 240px (w-60) when open, 64px (w-16) when closed
  // Use responsive margin-left for desktop, none for mobile
  return (
    <div
      className={`bg-gradient-to-r from-blue-100 via-blue-400 to-gray-600 shadow-lg w-full fixed top-0 left-0 z-30 h-[88px] flex items-center transition-all duration-300`}
      style={{
        marginLeft:
          typeof window !== "undefined" && window.innerWidth >= 768
            ? sidebarOpen
              ? 240
              : 64
            : 0,
      }}
    >
      <div className="mx-2 w-full">
        <div className="grid grid-cols-3 items-center">
          <div className="flex items-center ml-1">
            <Image
              src="/logo.png"
              alt="i-MSConsulting Logo"
              width={220}
              height={200}
              priority
              className="p-0 m-0"
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-semibold text-gray-100">
              Welcome {user?.fullname || "User"}
            </h1>
          </div>
          <div className="flex justify-end">
            {/* <Button
              onClick={onLogout}
              className="bg-white hover:bg-gray-100 text-gray-600 font-semibold"
            >
              Logout
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
