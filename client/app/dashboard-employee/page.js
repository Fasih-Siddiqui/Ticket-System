"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LucideTicket, LucideTicketPlus, LucideTicketCheck, LucideLoader2, LucideUserCheck, LucideAlertCircle } from 'lucide-react';
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [supportUsers, setSupportUsers] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [assigningTicket, setAssigningTicket] = useState(null);
  const [userData, setUserData] = useState(null);
  const [totalTickets, setTotalTickets] = useState(0);
  const [openTickets, setOpenTickets] = useState(0);
  const [inProgressTickets, setInProgressTickets] = useState(0);
  const [resolvedTickets, setResolvedTickets] = useState(0);
  const [closedTickets, setClosedTickets] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', description: '', priority: 'Low' });
  const router = useRouter();

  useEffect(() => {
    if (tickets) {
      setTotalTickets(tickets.length);
      setOpenTickets(tickets.filter((ticket) => ticket.Status === "Open").length);
      setInProgressTickets(tickets.filter((ticket) => ticket.Status === "In Progress").length);
      setResolvedTickets(tickets.filter((ticket) => ticket.Status === "Resolved").length);
      setClosedTickets(tickets.filter((ticket) => ticket.Status === "Closed").length);
    }
  }, [tickets]);

  // Sort tickets with closed ones at the bottom
  const sortTickets = (tickets) => {
    return [...tickets].sort((a, b) => {
      // If one is closed and the other isn't, put the closed one last
      if (a.Status === "Closed" && b.Status !== "Closed") return 1;
      if (a.Status !== "Closed" && b.Status === "Closed") return -1;
      
      // For tickets with the same status (both closed or both not closed),
      // sort by creation date (newest first)
      return new Date(b.CreatedAt) - new Date(a.CreatedAt);
    });
  };

  // Filter tickets based on search and status
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.CreatedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.TicketCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.Status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8081/api/tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sortedTickets = sortTickets(response.data);
      setTickets(sortedTickets);

      // Update statistics
      const stats = response.data.reduce(
        (acc, ticket) => {
          acc.total++;
          switch (ticket.Status) {
            case "Open":
              acc.open++;
              break;
            case "In Progress":
              acc.inProgress++;
              break;
            case "Resolved":
              acc.resolved++;
              break;
            case "Closed":
              acc.closed++;
              break;
          }
          return acc;
        },
        { total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 }
      );

      setTotalTickets(stats.total);
      setOpenTickets(stats.open);
      setInProgressTickets(stats.inProgress);
      setResolvedTickets(stats.resolved);
      setClosedTickets(stats.closed);
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
        if (!token) {
          router.push("/");
          return;
        }

        // Decode token to get user data
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decodedToken = JSON.parse(jsonPayload);
        setUserData(decodedToken);
        
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
      await axios.put(
        `http://localhost:8081/api/tickets/${ticketCode}/status`,
        { status: "Closed" },
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
            ? { ...ticket, Status: "Closed" }
            : ticket
        )
      );
      
      setError(null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        router.push("/");
      } else {
        setError("Failed to close ticket");
      }
    }
  };

  const handleCreateTicket = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8081/api/tickets`,
        newTicket,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchTickets();
      setIsModalOpen(false);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        router.push("/");
      } else {
        setError("Failed to create ticket");
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
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-400 to-gray-600 shadow-lg">
        <div className="mx-2 py-4">
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
                Welcome {userData?.fullname}
              </h1>
              
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/");
                }}
                className="bg-white hover:bg-gray-100 text-gray-600 font-semibold"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <Card 
            className="bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
            onClick={() => {
              setStatusFilter('all');
              setSearchQuery('');
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-white">Total Tickets</p>
                  <p className="text-3xl font-bold text-white mt-2">{totalTickets}</p>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10">
                <LucideTicket className="h-24 w-24 text-white transform translate-x-4 translate-y-4" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
            onClick={() => {
              setStatusFilter('Open');
              setSearchQuery('');
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-white">Open</p>
                  <p className="text-3xl font-bold text-white mt-2">{openTickets}</p>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10">
                <LucideTicketPlus className="h-24 w-24 text-white transform translate-x-4 translate-y-4" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
            onClick={() => {
              setStatusFilter('In Progress');
              setSearchQuery('');
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-white">In Progress</p>
                  <p className="text-3xl font-bold text-white mt-2">{inProgressTickets}</p>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10">
                <LucideLoader2 className="h-24 w-24 text-white transform translate-x-4 translate-y-4" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-green-500 to-green-600 shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
            onClick={() => {
              setStatusFilter('Resolved');
              setSearchQuery('');
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-white">Resolved</p>
                  <p className="text-3xl font-bold text-white mt-2">{resolvedTickets}</p>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10">
                <LucideTicketCheck className="h-24 w-24 text-white transform translate-x-4 translate-y-4" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-gray-500 to-gray-600 shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
            onClick={() => {
              setStatusFilter('Closed');
              setSearchQuery('');
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-white">Closed</p>
                  <p className="text-3xl font-bold text-white mt-2">{closedTickets}</p>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10">
                <LucideAlertCircle className="h-24 w-24 text-white transform translate-x-4 translate-y-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets Table Section */}
        <div className="bg-white rounded-lg shadow">
          {/* Table Controls */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex space-x-2">
              <Select 
                defaultValue="10" 
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="40">40</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="search"
                placeholder="Search..."
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-1 bg-blue-600 text-white hover:bg-blue-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Ticket</span>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Operations</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((ticket, index) => (
                  <tr key={ticket.TicketID} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-3 text-sm">{indexOfFirstItem + index + 1}</td>
                    <td className="px-6 py-3 text-sm text-blue-600 hover:text-blue-800">
                      <Link href={`/tickets/${ticket.TicketCode}`}>
                        {ticket.Title}
                      </Link>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${ticket.Priority === 'High' ? 'bg-red-100 text-red-800' : 
                          ticket.Priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                        {ticket.Priority}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${ticket.Status === 'Open' ? 'bg-blue-100 text-blue-800' : 
                          ticket.Status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          ticket.Status === 'Resolved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {ticket.Status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">{ticket.CreatedBy}</td>
                    <td className="px-6 py-3 text-sm">{new Date(ticket.Date).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-sm bg-white">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => router.push(`/tickets/${ticket.TicketCode}`)}
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTickets.length)} of {filteredTickets.length} entries
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index + 1}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Ticket</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the ticket.
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

        {/* Create Ticket Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new ticket.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTicket.title}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, title: e.target.value })
                  }
                  placeholder="Enter ticket title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTicket.description}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, description: e.target.value })
                  }
                  placeholder="Describe your issue"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(value) =>
                    setNewTicket({ ...newTicket, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTicket}>Create Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Footer */}
      <div className="w-full bg-gradient-to-r from-blue-100 via-blue-400 to-gray-600 shadow-lg text-white py-2 text-center">
        <p>&copy; {new Date().getFullYear()} i-MSConsulting | All rights reserved. Designed by i-MSConsulting.</p>
      </div>
    
    </div>
  );
}
