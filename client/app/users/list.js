"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation"; import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import axios from "axios";


export default function UsersListPage({ onCreateUser, users: propUsers, loading: propLoading, error: propError, refreshUsers }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const users = Array.isArray(propUsers) ? propUsers : [];
  const loading = !!propLoading;
  const error = propError || null;
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter(); // <-- Add this line

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      (user.username?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (user.firstName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (user.lastName?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshUsers(); // aapka prop function
    setRefreshing(false);
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-200 ${sidebarCollapsed ? "ml-16" : "ml-56"}`}>
        {/* Header */}
        {/* Unified Topbar/Navbar */}
        <nav className="w-full flex items-center justify-between px-3 py-2 bg-white/90 backdrop-blur-md shadow-md z-20 border-b border-blue-100 sticky top-0 left-0 right-0" style={{ minHeight: '64px' }}>
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
            <div className="text-white text-xl font-bold" style={{ color: "#1d4ed8" }}>
              PickaTicket
            </div>
            {/* <span className="text-2xl font-bold text-blue-900 tracking-tight hidden sm:inline">i-MSConsulting</span> */}
          </div>
          <div className="flex items-center gap-4">
            {/* Search Field */}
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 shadow-sm"
              style={{ minWidth: '180px' }}
            />
            {/* Notification Bell */}
            <button className="relative p-2 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 shadow">3</span>
            </button>
            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/");
              }}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Logout
            </button>
          </div>
        </nav>
        {/* Cards Section (like dashboard-admin) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8 p-6">
          {/* Example cards, replace with real stats if available */}
          <Card className="relative overflow-hidden border border-blue-500 bg-white shadow-md group transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-blue-500 to-blue-600 opacity-10 z-0" />
            <CardContent className="p-6 flex flex-col gap-2 z-10 relative">
              <div className="flex items-center gap-3">
                <div className="rounded-full p-3 bg-blue-100 shadow-sm">
                  <span className="w-7 h-7 text-blue-600 font-bold text-lg">{users.length}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-800 leading-tight">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Add more cards for Active, Inactive, Admins, etc. as needed */}
        </div>
        {/* Table Filters (like dashboard-admin) */}
        <div className="bg-white rounded-lg shadow mb-6 mx-6">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
            <div className="flex space-x-2 items-center">
              <Input
                type="search"
                placeholder="Search users..."
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>z
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 w-full justify-end">
              <label htmlFor="rowsPerPage" className="text-xs text-gray-600">Rows per page:</label>
              <select
                id="rowsPerPage"
                value={itemsPerPage}
                onChange={e => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[10, 20, 30, 40, 50, 100].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <Button
                onClick={handleRefresh}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
              >
                Refresh
              </Button>
              <Button
                onClick={onCreateUser}
                className="flex items-center space-x-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create User</span>
              </Button>

            </div>
          </div>
          {/* Table */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-6 py-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-3 font-bold">#</th>
                  <th className="px-6 py-3 font-bold">First Name</th>
                  <th className="px-6 py-3 font-bold">Last Name</th>
                  <th className="px-6 py-3 font-bold">Username</th>
                  <th className="px-6 py-3 font-bold">Email</th>
                  <th className="px-6 py-3 font-bold">Role</th>
                  <th className="px-6 py-3 font-bold">Status</th>
                  <th className="px-6 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8">
                      Loading users...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={9} className="text-center text-red-600 py-8">{error}</td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8">No users found.</td>
                  </tr>
                ) : (
                  currentItems.map((user, idx) => (
                    <tr key={user.id || user.username} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="px-6 py-3 text-sm">{indexOfFirstItem + idx + 1}</td>
                      <td className="px-6 py-3 text-sm">{user.firstName}</td>
                      <td className="px-6 py-3 text-sm">{user.lastName}</td>
                      <td className="px-6 py-3 text-sm">{user.username}</td>
                      <td className="px-6 py-3 text-sm">{user.email}</td>
                      <td className="px-6 py-3 text-sm capitalize">{user.role}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{user.status}</span>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">View</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination (like dashboard-admin) */}
          <div className="px-4 py-3 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
            <div className="flex items-center text-sm text-gray-500 gap-4">
              <span>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`rounded-full border border-gray-300 bg-white shadow-sm hover:bg-blue-50 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Previous page"
              >
                &lt;
              </Button>
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index + 1}
                  variant={currentPage === index + 1 ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setCurrentPage(index + 1)}
                  className={`rounded-full border ${currentPage === index + 1 ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'} mx-0.5 transition-colors`}
                  aria-label={`Page ${index + 1}`}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`rounded-full border border-gray-300 bg-white shadow-sm hover:bg-blue-50 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Next page"
              >
                &gt;
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
