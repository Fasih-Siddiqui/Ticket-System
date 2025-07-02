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

export default function UsersPage() {
  const [view, setView] = useState("list");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <div className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 shadow-sm border-b border-gray-200">
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
          </div>
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
