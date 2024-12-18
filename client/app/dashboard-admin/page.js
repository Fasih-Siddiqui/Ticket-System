"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, RefreshCw, UserPlus, Eye, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [supportUsers, setSupportUsers] = useState([]);
  const [assigningTicket, setAssigningTicket] = useState(null);
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
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch tickets
        await fetchTickets();

        // Fetch support users
        const supportResponse = await axios.get("http://localhost:8081/api/support-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSupportUsers(supportResponse.data);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          router.push("/");
        } else {
          setError("Failed to fetch data");
        }
      }
    };

    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTickets();
  };

  const handleDelete = async (ticketCode) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8081/api/tickets/${ticketCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
      await fetchTickets(); // Refresh the tickets list
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        router.push("/");
      } else {
        setError("Failed to delete ticket");
      }
    }
  };

  const confirmDelete = (ticket) => {
    setTicketToDelete(ticket);
    setDeleteDialogOpen(true);
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

  const handleAssignTicket = async (ticketCode, username) => {
    try {
      setAssigningTicket(ticketCode);
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8081/api/tickets/${ticketCode}/assign`,
        { assignedTo: username === "unassigned" ? null : username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchTickets();
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        router.push("/");
      } else {
        setError("Failed to assign ticket");
      }
    } finally {
      setAssigningTicket(null);
    }
  };

  const handleCloseTicket = async (ticketCode) => {
    try {
      const token = localStorage.getItem("token");
      console.log('Attempting to close ticket:', ticketCode); // Debug log

      const response = await axios.put(
        `http://localhost:8081/api/tickets/${ticketCode}/close`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Close ticket response:', response); // Debug log

      if (response.status === 200) {
        await fetchTickets(); // Refresh the ticket list
      }
    } catch (error) {
      console.error("Error closing ticket:", error.response || error);
      setError(error.response?.data?.error || "Failed to close ticket");
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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            {userData && (
              <p className="text-gray-600">Welcome, {userData.fullname}</p>
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
      <Card className="bg-blue-500 text-white hover:shadow-lg hover:cursor-pointer transition-shadow duration-300">
  <CardContent>
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
                    Created by: {ticket.CreatedBy}
                  </p>
                  {ticket.AssignedTo && (
                    <p className="text-sm text-gray-500">
                      Assigned to: {ticket.AssignedTo}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Select 
                    onValueChange={(value) => handleAssignTicket(ticket.TicketCode, value)}
                    value={ticket.AssignedTo || "unassigned"}
                  >
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <UserPlus className={`h-4 w-4 ${assigningTicket === ticket.TicketCode ? 'animate-spin' : ''}`} />
                        <span>
                          {ticket.AssignedTo || "Assign To"}
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">
                        Unassigned
                      </SelectItem>
                      {supportUsers.map((user) => (
                        <SelectItem key={user.UserId} value={user.Username}>
                          {user.Username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Link href={`/tickets/${ticket.TicketCode}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => confirmDelete(ticket)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                  {ticket.Status === "Resolved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 shadow-md border-2 border-green-200 hover:bg-green-100"
                      onClick={() => handleCloseTicket(ticket.TicketCode)}
                    >
                      <CheckCircle2 className="h-4 w-4" color="#16a34a" />
                      Close Ticket
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Ticket</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete ticket #{ticketToDelete?.TicketCode}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(ticketToDelete?.TicketCode)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
