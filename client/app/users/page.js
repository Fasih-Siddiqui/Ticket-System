"use client";

import React, { useState } from "react";
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
import Image from "next/image";

export default function UsersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (
      firstName === "" ||
      lastName === "" ||
      username === "" ||
      email === "" ||
      password === "" ||
      role === "" ||
      phone === "" ||
      department === "" ||
      designation === "" ||
      status === ""
    ) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    // TODO: Replace with actual API call
    setTimeout(() => {
      setLoading(false);
      setSuccess("User added successfully!");
      setFirstName("");
      setLastName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("");
      setPhone("");
      setDepartment("");
      setDesignation("");
      setStatus("active");
      setProfilePic(null);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ${
          sidebarCollapsed ? "ml-16" : "ml-56"
        }`}
      >
        <div className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 shadow-sm border-b border-gray-200">
          <div className="mx-2 py-0.5">
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
                <h1 className="text-2xl font-bold text-gray-700 leading-tight font-sans tracking-tight drop-shadow-sm">
                  Create Users
                </h1>
              </div>
              <div></div>
            </div>
          </div>
        </div>
        <div className="w-full py-8 flex-grow px-4 md:px-8 lg:px-18">
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="text-xl font-bold">Add User</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
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
                {success && (
                  <div className="text-green-600 font-medium">{success}</div>
                )}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
