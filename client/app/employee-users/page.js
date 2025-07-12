"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmployeeSidebar from "@/components/EmployeeSidebar";
import { LucideUser, LucideUserPlus, LucideUsers, LucideUserCheck } from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  // State hooks must be at the top
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const router = useRouter();

  // Fetch user from token if available (copy logic from dashboard page)
  useEffect(() => {
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

  // Example user stats
  const stats = [
    {
      label: "Total Users",
      value: 42,
      color: "from-blue-400 to-blue-600",
      icon: <LucideUsers className="w-8 h-8 text-blue-600" />,
    },
    {
      label: "Active Users",
      value: 35,
      color: "from-green-400 to-green-600",
      icon: <LucideUserCheck className="w-8 h-8 text-green-600" />,
    },
    {
      label: "New Users",
      value: 5,
      color: "from-yellow-400 to-yellow-600",
      icon: <LucideUserPlus className="w-8 h-8 text-yellow-500" />,
    },
    {
      label: "Admins",
      value: 2,
      color: "from-cyan-400 to-cyan-600",
      icon: <LucideUser className="w-8 h-8 text-cyan-600" />,
    },
  ];

  // Example user data for table
  const users = [
    { id: 1, name: "Alice Smith", email: "alice@example.com", role: "Employee", status: "Active" },
    { id: 2, name: "Bob Johnson", email: "bob@example.com", role: "Support", status: "Active" },
    { id: 3, name: "Carol Lee", email: "carol@example.com", role: "Employee", status: "Inactive" },
    { id: 4, name: "David Kim", email: "david@example.com", role: "Admin", status: "Active" },
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
          <p className="text-gray-500">Manage users, view stats, and perform user actions.</p>
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
        {/* Users Table Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          {/* Table Controls */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-700">User List</h2>
            <Button className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center">
              <LucideUserPlus className="w-4 h-4 mr-2" /> Add User
            </Button>
          </div>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-6 py-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Operations</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage).map((user, idx) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-3 text-sm">{(currentPage-1)*itemsPerPage + idx + 1}</td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.role === 'Admin' ? 'bg-cyan-100 text-cyan-800' :
                          user.role === 'Support' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'}`}>{user.role}</span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{user.status}</span>
                    </td>
                    <td className="px-6 py-3 text-right bg-white">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              Showing {(currentPage-1)*itemsPerPage+1} to {Math.min(currentPage*itemsPerPage, users.length)} of {users.length} entries
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {[...Array(Math.ceil(users.length/itemsPerPage))].map((_, index) => (
                <Button
                  key={index + 1}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === Math.ceil(users.length/itemsPerPage)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
