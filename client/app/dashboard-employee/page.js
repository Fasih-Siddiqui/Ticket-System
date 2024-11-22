"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Edit2, Plus, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EmployeeDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  // Calculate ticket counts
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((ticket) => ticket.Status === "Open").length;
  const inProgressTickets = tickets.filter((ticket) => ticket.Status === "In Progress").length;
  const closedTickets = tickets.filter((ticket) => ticket.Status === "Closed").length;

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8081/api/tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTickets(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        router.push("/");
      } else {
        setError("Failed to fetch tickets");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    // Decode token to get user data
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      setUserData(JSON.parse(jsonPayload));
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem('token');
      router.push('/');
      return;
    }

    fetchTickets();
  }, [router]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTickets();
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Open: "bg-yellow-500",
      "In Progress": "bg-blue-500",
      Closed: "bg-green-500",
    };
    return statusColors[status] || "bg-gray-500";
  };

  const getPriorityColor = (priority) => {
    const priorityColors = {
      Low: "bg-green-500",
      Medium: "bg-yellow-500",
      High: "bg-red-500",
    };
    return priorityColors[priority] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Tickets</h1>
            {userData && (
              <p className="text-gray-600">Welcome, {userData.username}</p>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            className={refreshing ? "animate-spin" : ""}
            disabled={refreshing}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-4">
          <Button
            variant="default"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Ticket
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-500 text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Total Tickets</h3>
            <p className="text-3xl font-bold">{totalTickets}</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500 text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Open Tickets</h3>
            <p className="text-3xl font-bold">{openTickets}</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-600 text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">In Progress</h3>
            <p className="text-3xl font-bold">{inProgressTickets}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500 text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Closed Tickets</h3>
            <p className="text-3xl font-bold">{closedTickets}</p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <Card key={ticket.TicketID} className="w-full hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold">{ticket.Title}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(
                        ticket.Status
                      )}`}
                    >
                      {ticket.Status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs text-white ${getPriorityColor(
                        ticket.Priority
                      )}`}
                    >
                      {ticket.Priority}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">#{ticket.TicketCode}</p>
                  <p className="text-sm text-gray-500">
                    Created on: {new Date(ticket.Date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href={`/tickets/${ticket.TicketCode}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Edit2 className="h-4 w-4" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Ticket Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
          </DialogHeader>
          {/* Add your ticket creation form here */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
