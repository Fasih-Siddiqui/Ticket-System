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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LucideTicket,
  LucideTicketPlus,
  LucideTicketCheck,
  LucideLoader2,
  LucideUserCheck,
  LucideAlertCircle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Filter,
  ArrowLeft,
  ArrowRight,
  LucideRefreshCcw,
  LucideCalendar,
  LucideTag,
  LucideFlag,
  LucidePlus,
  LucideEye,
  LucideTrash
} from 'lucide-react';
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { API_BASE_URL } from "../config";
import Sidebar from "@/components/Sidebar";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const router = useRouter();

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setDirection] = useState('asc');
  const [activeFilters, setActiveFilters] = useState({});
  const [columnFilters, setColumnFilters] = useState({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', description: '', priority: 'Low' });

  useEffect(() => {
    if (tickets) {
      setTotalTickets(tickets.length);
      setOpenTickets(tickets.filter((ticket) => ticket.Status === "Open").length);
      setInProgressTickets(tickets.filter((ticket) => ticket.Status === "In Progress").length);
      setResolvedTickets(tickets.filter((ticket) => ticket.Status === "Resolved").length);
      setClosedTickets(tickets.filter((ticket) => ticket.Status === "Closed").length);
    }
  }, [tickets]);

  const sortTickets = (tickets) => {
    if (!Array.isArray(tickets)) return [];
    
    return [...tickets].sort((a, b) => {
      if (sortField) {
        let compareA = a[sortField];
        let compareB = b[sortField];

        if (sortField === 'Date') {
          compareA = new Date(compareA);
          compareB = new Date(compareB);
        }

        if (compareA < compareB) {
          return sortDirection === 'asc' ? -1 : 1;
        }
        if (compareA > compareB) {
          return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      }

      if (a.Status === "Closed" && b.Status !== "Closed") return 1;
      if (a.Status !== "Closed" && b.Status === "Closed") return -1;
      return new Date(b.CreatedAt) - new Date(a.CreatedAt);
    });
  };

  const getFilteredTickets = () => {
    return tickets.filter(ticket => {
      const matchesSearch = searchQuery === '' || (
        (ticket.Title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (ticket.CreatedBy?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (ticket.TicketCode?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      );

      const matchesStatus = statusFilter === 'all' || ticket.Status === statusFilter;

      // Column filters
      const matchesColumnFilters = Object.entries(columnFilters).every(([field, value]) => {
        if (!value) return true;
        const ticketValue = (ticket[field] || '').toString().toLowerCase();
        return ticketValue.includes(value.toLowerCase());
      });

      return matchesSearch && matchesStatus && matchesColumnFilters;
    });
  };

  const filteredTickets = getFilteredTickets();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched tickets response:", response.data);

      const ticketData = Array.isArray(response.data) ? response.data : [];
      const sortedTickets = sortTickets(ticketData);
      setTickets(sortedTickets);
      return sortedTickets;

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

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decodedToken = JSON.parse(jsonPayload);
        setUserData(decodedToken);

        await fetchTickets();

        const supportResponse = await axios.get(`${API_BASE_URL}/api/support-users`, {
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
    setSearchQuery("");
    setStatusFilter("all");
    setActiveFilters({});
    setColumnFilters({});
    setSortField(null);
    setDirection("asc");
    const newTickets = await fetchTickets();
    setTickets(newTickets);
    setRefreshing(false);
    setCurrentPage(1);
  };

  const handleDelete = async (ticketCode) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/tickets/${ticketCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
      await fetchTickets();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        router.push("/");
      } else {
        setError("Failed to delete ticket");
      }
    }
  };

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setDirection(newDirection);

    const sortedTickets = [...tickets].sort((a, b) => {
      let compareA = a[field];
      let compareB = b[field];

      if (field === 'Date') {
        compareA = new Date(compareA);
        compareB = new Date(compareB);
      }

      if (compareA < compareB) {
        return newDirection === 'asc' ? -1 : 1;
      }
      if (compareA > compareB) {
        return newDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setTickets(sortedTickets);
  };

  const handleFilter = (field) => {
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [field]: !prevFilters[field],
    }));
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
        `${API_BASE_URL}/api/tickets/${ticketCode}/assign`,
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
        `${API_BASE_URL}/api/tickets/${ticketCode}/status`,
        { status: "Closed" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    if (!newTicket.title.trim() || !newTicket.description.trim() || !newTicket.priority.trim()) {
      toast.error("Please fill all required fields.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/tickets`,
        newTicket,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchTickets();
      setIsModalOpen(false);
      setNewTicket({ title: '', description: '', priority: 'Low' });
      toast.success("Ticket created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        router.push("/");
      } else {
        toast.error("Failed to create ticket. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
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

  console.log("Fetched data:", tickets);
  console.log("Filtered tickets:", filteredTickets);
  console.log("Current items:", currentItems);

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          onLogout={() => {
            localStorage.removeItem("token");
            router.push("/");
          }}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        <div className={`flex-1 flex flex-col transition-all duration-200 ${sidebarCollapsed ? "ml-16" : "ml-56"}`}>
          {/* Header Section */}
          <div className={`bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 shadow-sm border-b border-gray-200`}>
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
                  <h1 className="text-2xl font-bold text-gray-700 leading-tight font-sans tracking-tight drop-shadow-sm" style={{ fontFamily: 'Segoe UI, Arial, Helvetica, sans-serif' }}>
                    Welcome <span className="font-black text-gray-800">{userData?.fullname}</span>
                  </h1>
                </div>
                <div className="flex justify-end"></div>
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-grow p-6">
            {/* Ticket Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
              {/* ...cards for Total, Open, In Progress, Resolved, Closed... */}
              {[{
                label: 'Total Tickets', value: totalTickets, icon: LucideTicket, gradient: 'from-blue-500 to-blue-600', border: 'border-blue-500', iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
              }, {
                label: 'Open', value: openTickets, icon: LucideTicketPlus, gradient: 'from-yellow-400 to-yellow-500', border: 'border-yellow-400', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-500',
              }, {
                label: 'In Progress', value: inProgressTickets, icon: LucideLoader2, gradient: 'from-orange-400 to-orange-500', border: 'border-orange-400', iconBg: 'bg-orange-100', iconColor: 'text-orange-500',
              }, {
                label: 'Resolved', value: resolvedTickets, icon: LucideTicketCheck, gradient: 'from-green-500 to-green-600', border: 'border-green-500', iconBg: 'bg-green-100', iconColor: 'text-green-600',
              }, {
                label: 'Closed', value: closedTickets, icon: LucideAlertCircle, gradient: 'from-gray-400 to-gray-500', border: 'border-gray-400', iconBg: 'bg-gray-100', iconColor: 'text-gray-600',
              }].map((card) => (
                <Card key={card.label} className={`relative overflow-hidden border ${card.border} bg-white shadow-md group transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}>
                  <div className={`absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-br ${card.gradient} opacity-10 z-0`} />
                  <CardContent className="p-6 flex flex-col gap-2 z-10 relative">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-3 ${card.iconBg} shadow-sm`}>
                        <card.icon className={`w-7 h-7 ${card.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{card.label}</p>
                        <p className="text-3xl font-bold text-gray-800 leading-tight">{card.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Tickets Table Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
                <div className="flex space-x-2 items-center">
                  <Select defaultValue="10" onValueChange={handleItemsPerPageChange}>
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
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                  <Button onClick={handleRefresh} className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">Refresh</Button>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="search"
                    placeholder="Search..."
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-1 bg-blue-600 text-white hover:bg-blue-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create Ticket</span>
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-12 px-6 py-3">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      {[{ id: 'TicketID', label: 'No' }, { id: 'Title', label: 'Title' }, { id: 'Priority', label: 'Priority' }, { id: 'Status', label: 'Status' }, { id: 'CreatedBy', label: 'Created By' }, { id: 'Date', label: 'Created At' }].map((column) => (
                        <th key={column.id} className="px-6 py-3 font-bold">
                          <div className="flex flex-col items-start">
                            <div className="flex items-center space-x-2 text-xs text-gray-500 uppercase">
                              <span>{column.label}</span>
                            </div>
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Operations</th>
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
                          <Link href={`/tickets/${ticket.TicketCode}`}>{ticket.Title}</Link>
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
                        <td className="px-6 py-3 text-sm">{new Date(ticket.Date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</td>
                        <td className="px-6 py-3 text-sm bg-white">
                          <div className="flex items-center justify-end space-x-2">
                            <Select value={ticket.AssignedTo || "unassigned"} onValueChange={(value) => handleAssignTicket(ticket.TicketCode, value)}>
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Assign to..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                {supportUsers.map((user) => (
                                  <SelectItem key={user.Username} value={user.Username}>{user.Username}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => router.push(`/tickets/${ticket.TicketCode}`)}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Button>
                            {ticket.Status !== "Closed" && (
                              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800" onClick={() => handleCloseTicket(ticket.TicketCode)}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => confirmDelete(ticket)}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination, Dialogs, and Create Ticket Modal (as in your working employee page) */}
              <div className="flex flex-col md:flex-row items-center justify-between p-4">
                <div className="flex-1 flex gap-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-sm text-gray-500">
                    Page{" "}
                    <span className="font-medium text-gray-700">
                      {currentPage} of {totalPages}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full bg-gradient-to-r from-blue-100 via-blue-400 to-gray-600 shadow-lg text-white py-2 text-center">
            <p>&copy; {new Date().getFullYear()} i-MSConsulting | All rights reserved. Designed by i-MSConsulting.</p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm text-gray-500">
            Are you sure you want to delete this ticket? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="w-full sm:w-auto"
              onClick={() => handleDelete(ticketToDelete?.TicketCode)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Ticket Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Create Ticket</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </Label>
              <Input
                id="title"
                value={newTicket.title}
                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                placeholder="Enter ticket title"
              />
            </div>
            <div>
              <Label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                placeholder="Enter ticket description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </Label>
              <Select
                id="priority"
                value={newTicket.priority}
                onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
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
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleCreateTicket}
            >
              Create Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
