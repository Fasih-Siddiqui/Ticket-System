"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Edit2, LucideTicket, LucideTicketCheck, LucideTicketPlus, LucideTickets, Plus, RefreshCw, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

export default function EmployeeDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "",
    date: new Date().toISOString().split('T')[0],
    status: "Open"
  }); 
  const [totalTickets, setTotalTickets] = useState(0);
  const [openTickets, setOpenTickets] = useState(0);
  const [inProgressTickets, setInProgressTickets] = useState(0);
  const [resolvedTickets, setResolvedTickets] = useState(0);
  const [closedTickets, setClosedTickets] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (tickets) {
      setTotalTickets(tickets.length);
      setOpenTickets(tickets.filter(ticket => ticket.Status === 'Open').length);
      setInProgressTickets(tickets.filter(ticket => ticket.Status === 'In Progress').length);
      setResolvedTickets(tickets.filter(ticket => ticket.Status === 'Resolved').length);
      setClosedTickets(tickets.filter(ticket => ticket.Status === 'Closed').length);
    }
  }, [tickets]);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      // Debug: Log the token payload
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      console.log("Token payload:", tokenPayload);

      const response = await axios.get("http://localhost:8081/api/support-tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filter out closed tickets
      const activeTickets = response.data.filter(ticket => 
        ticket.Status !== 'Closed'
      );
      setTickets(activeTickets);
      setError(null);
    } catch (err) {
      console.error("Error fetching tickets:", err.response || err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        router.push("/");
      } else {
        setError("Failed to fetch assigned tickets");
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
      Open: "bg-gray-200 border-2 border-black-700",
      "In Progress": "bg-blue-200 border-2 border-blue-700",
      Closed: "bg-gray-200 border-2 border-black-700",
    };
    return statusColors[status] || "bg-gray-500";
  };

  const getPriorityColor = (priority) => {
    const priorityColors = {
      Low: "bg-green-200 border-2 border-green-700",
      Medium: "bg-purple-200 border-2 border-purple-700",
      High: "bg-red-200 border-2 border-red-700",
    };
    return priorityColors[priority] || "bg-gray-500";
  };

  const handleCloseTicket = async (ticketCode) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8081/api/tickets/${ticketCode}/status`,
        { status: "Closed" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh tickets after closing
      await fetchTickets();
    } catch (error) {
      console.error("Error closing ticket:", error);
      setError("Failed to close ticket");
    }
  };

  const handleResolveTicket = async (ticketCode) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8081/api/tickets/${ticketCode}/status`,
        { status: "Resolved" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update the ticket status in the local state
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.TicketCode === ticketCode
            ? { ...ticket, Status: "Resolved" }
            : ticket
        )
      );
      
      setError(null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        router.push("/");
      } else {
        setError("Failed to resolve ticket");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto ">
       {/* <div className={`${font.className} min-h-screen flex flex-col`}> */}
      {/* Navbar / Header */}
      <header
        className="flex items-center justify-between px-2 w-full border border-gray-100 rounded-lg mb-3"
        style={{ backgroundImage: `linear-gradient(to bottom, white 50%, gray 300%)` }}
      >
        {/* Logo */}
        <div className="flex items-center space-x-4">
         
        <Image
          src="/logo.png"
          className="w-auto h-16 p-2"
          alt="Dafnia Logo"
          width={200}
          height={200}
        />
        </div>

        {/* Title */}
        {userData && (
              <p className="text-blue-900 font-bold text-2xl">Welcome {userData.fullname}</p>
            )}

        {/* Logout Button */}
        <div className="flex items-center space-x-4">
         
          <Link href="/">
          <Button
            variant="outline"
            className="bg-blue-900 text-white hover:bg-gray-300 font-semibold"
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/");
            }}
          >
            Logout
          </Button>
          </Link>
        </div>
      </header>
      {/* <hr className="w-full border-gray-600" /> */}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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

        <Card className="bg-orange-500 text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">In Progress</h3>
            <p className="text-3xl font-bold">{inProgressTickets}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-500 text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Resolved</h3>
            <p className="text-3xl font-bold">{resolvedTickets}</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-500 text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Closed</h3>
            <p className="text-3xl font-bold">{closedTickets}</p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 p-4">
        {tickets.map((ticket) => (
          <Card key={ticket.TicketCode} className="w-full hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold">{ticket.Title}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs text-black ${getStatusColor(
                        ticket.Status
                      )}`}
                    >
                      {ticket.Status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs text-black ${getPriorityColor(
                        ticket.Priority
                      )}`}
                    >
                      {ticket.Priority}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">#{ticket.TicketCode}</p>
                  <p className="text-sm text-gray-500">
                    Created by: {ticket.CreatedBy}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created on: {new Date(ticket.Date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2 mt-10">
                  <Link href={`/tickets/${ticket.TicketCode}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 shadow-md border-2 border-gray-200">
                      <Edit2 className="h-4 w-4" color="#1E3A8A" />
                      View Details
                    </Button>
                  </Link>
                  {ticket.Status !== "Resolved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 shadow-md border-2 border-blue-200 hover:bg-blue-100"
                      onClick={() => handleResolveTicket(ticket.TicketCode)}
                    >
                      <CheckCircle2 className="h-4 w-4" color="#2563eb" />
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {tickets.length === 0 && (
          <Card className="w-full">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No tickets have been assigned to you yet.</p>
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
}
