"use client";

import React, { useState, useEffect } from "react";
import UsersListPage from "./list";
import Sidebar from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const router = useRouter();
  const [view, setView] = useState("list");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");


  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/users");
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handler to switch to create user view
  const handleCreateUser = () => {
    setView("create");
  };

  // Handler to return to list view
  const handleBackToList = () => {
    setView("list");
  };

  // Handler to add a new user (simulate API call, then refresh list)
  const handleAddUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post("/api/users", userData);
      await fetchUsers();
      setView("list");
    } catch (err) {
      setError("Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  if (view === "create") {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col transition-all duration-200 ml-56">
          {/* <div className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 shadow-sm border-b border-gray-200">
            <div className="mx-2 py-0.5">
              <div className="grid grid-cols-3 items-center">
                <div className="flex items-center ml-1">
                  <img
                    src="/logo.png"
                    alt="i-MSConsulting Logo"
                    width={220}
                    height={200}
                    className="p-0 m-0"
                  />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-2xl font-bold text-gray-700 leading-tight font-sans tracking-tight drop-shadow-sm">
                    Create User
                  </h1>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleBackToList}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 font-semibold"
                  >
                    Back to List
                  </button>
                </div>
              </div>
            </div>
          </div> */}
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
                  router.push("/users");
                }}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Back
              </button>
            </div>
          </nav>
          {/* User creation form */}
          <div className="w-full py-8 flex-grow px-4 md:px-8 lg:px-18">
            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-bold">Add User</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <UserCreateForm
                  onAddUser={handleAddUser}
                  loading={loading}
                  error={error}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <UsersListPage
      onCreateUser={handleCreateUser}
      users={users}
      loading={loading}
      error={error}
      refreshUsers={fetchUsers}
    />
  );
}

function UserCreateForm({ onAddUser, loading, error }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [status, setStatus] = useState("active");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !role ||
      !phone ||
      !department ||
      !designation ||
      !status
    ) {
      return;
    }
    await onAddUser({
      firstName,
      lastName,
      username,
      email,
      password,
      role,
      phone,
      department,
      designation,
      status,
    });
  };

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            name="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            name="designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={setRole} required>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus} required>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {error && <div className="text-red-600 font-medium">{error}</div>}
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
