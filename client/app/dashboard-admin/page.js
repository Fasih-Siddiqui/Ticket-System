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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        onLogout={() => {
          localStorage.removeItem("token");
          router.push("/");
        }}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ${sidebarCollapsed ? "ml-16" : "ml-56"}`}
      >
        {/* Unified Topbar/Navbar */}
        <nav className="w-full flex items-center justify-between px-3 py-2 bg-white/90 backdrop-blur-md shadow-md z-20 border-b border-blue-100 sticky top-0 left-0 right-0" style={{ minHeight: '64px' }}>
          <div className="flex items-center gap-2">
            <Image
              src="/IMSC I - 1 - logo.png"
              alt="i-MSConsulting Logo"
              width={56}
              height={56}
              priority
              className=""
              style={{ display: 'block', margin: 0, padding: 0 }}
            />
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

        <div className="flex-grow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {/* Card data */}
            {[
              {
                label: 'Total Tickets',
                value: totalTickets,
                icon: LucideTicket,
                gradient: 'from-blue-500 to-blue-600',
                border: 'border-blue-500',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
              },
              {
                label: 'Open',
                value: openTickets,
                icon: LucideTicketPlus,
                gradient: 'from-yellow-400 to-yellow-500',
                border: 'border-yellow-400',
                iconBg: 'bg-yellow-100',
                iconColor: 'text-yellow-500',
              },
              {
                label: 'In Progress',
                value: inProgressTickets,
                icon: LucideLoader2,
                gradient: 'from-orange-400 to-orange-500',
                border: 'border-orange-400',
                iconBg: 'bg-orange-100',
                iconColor: 'text-orange-500',
              },
              {
                label: 'Resolved',
                value: resolvedTickets,
                icon: LucideTicketCheck,
                gradient: 'from-green-500 to-green-600',
                border: 'border-green-500',
                iconBg: 'bg-green-100',
                iconColor: 'text-green-600',
              },
              {
                label: 'Closed',
                value: closedTickets,
                icon: LucideAlertCircle,
                gradient: 'from-gray-400 to-gray-500',
                border: 'border-gray-400',
                iconBg: 'bg-gray-100',
                iconColor: 'text-gray-600',
              },
            ].map((card, idx) => (
              <Card
                key={card.label}
                className={`relative overflow-hidden border ${card.border} bg-white shadow-md group transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}
              >
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

          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
              <div className="flex space-x-2 items-center">
                <Select
                  defaultValue="10"
                  onValueChange={handleItemsPerPageChange}
                >
                  {/* <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger> */}
                  {/* <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="40">40</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent> */}
                </Select>
                {/* <Select
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
                </Select> */}

               
                {/* <input
                  type="search"
                  placeholder="Search..."
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                /> */}

              
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleRefresh}
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                >
                  Refresh
                </Button>
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
            {/* Tickets Table */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-12 px-6 py-3">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    {[
                      { id: 'TicketID', label: 'No' },
                      { id: 'Title', label: 'Title' },
                      { id: 'Priority', label: 'Priority' },
                      { id: 'Status', label: 'Status' },
                      { id: 'CreatedBy', label: 'Created By' },
                      { id: 'Date', label: 'Created At' }
                    ].map((column) => (
                      <th 
                        key={column.id}
                        className="px-6 py-3 font-bold"
                      >
                        <div className="flex flex-col items-start">
                          <div className="flex items-center space-x-2 text-xs text-gray-500 uppercase">
                            <span>{column.label}</span>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => handleSort(column.id)}
                                className="p-1 rounded border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
                                title="Sort"
                              >
                                {sortField === column.id ? (
                                  sortDirection === 'asc' ? (
                                    <ArrowUp className="h-3.5 w-3.5 text-blue-500" />
                                  ) : (
                                    <ArrowDown className="h-3.5 w-3.5 text-blue-500" />
                                  )
                                ) : (
                                  <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                                )}
                              </button>
                              <button 
                                onClick={() => handleFilter(column.id)}
                                className="p-1 rounded border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
                                title="Filter"
                              >
                                <Filter 
                                  className={`h-3.5 w-3.5 ${
                                    activeFilters?.[column.id] 
                                      ? 'text-blue-500' 
                                      : 'text-gray-400'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                          {activeFilters[column.id] && (
                            <input
                              type="text"
                              className="mt-1 px-2 py-1 border border-gray-300 rounded text-xs w-full"
                              placeholder={`Filter ${column.label}`}
                              value={columnFilters[column.id] || ''}
                              onChange={e => setColumnFilters(filters => ({ ...filters, [column.id]: e.target.value }))}
                            />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Operations
                    </th>
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
                      <td className="px-6 py-3 text-sm">
                        {new Date(ticket.Date).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </td>
                      <td className="px-6 py-3 text-sm bg-white">
                        <div className="flex items-center justify-end space-x-2">
                          <Select
                            value={ticket.AssignedTo || "unassigned"}
                            onValueChange={(value) => handleAssignTicket(ticket.TicketCode, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Assign to..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">Unassigned</SelectItem>
                              {supportUsers.map((user) => (
                                <SelectItem key={user.Username} value={user.Username}>
                                  {user.Username}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                          {ticket.Status !== "Closed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-gray-800"
                              onClick={() => handleCloseTicket(ticket.TicketCode)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => confirmDelete(ticket)}
                          >
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

            <div className="px-4 py-3 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
              <div className="flex items-center text-sm text-gray-500 gap-4">
                <span>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTickets.length)} of {filteredTickets.length} entries
                </span>
                <div className="flex items-center gap-2">
                  <label htmlFor="rowsPerPage" className="text-xs text-gray-600">Rows per page:</label>
                  <select
                    id="rowsPerPage"
                    value={itemsPerPage}
                    onChange={e => handleItemsPerPageChange(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[10, 20, 30, 40, 50, 100].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`rounded-full border border-gray-300 bg-white shadow-sm hover:bg-blue-50 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label="Previous page"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index + 1}
                    variant={currentPage === index + 1 ? "default" : "ghost"}
                    size="icon"
                    onClick={() => handlePageChange(index + 1)}
                    className={`rounded-full border ${currentPage === index + 1 ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'} mx-0.5 transition-colors`}
                    aria-label={`Page ${index + 1}`}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`rounded-full border border-gray-300 bg-white shadow-sm hover:bg-blue-50 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label="Next page"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

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
        </div>

        <div className="w-full bg-gradient-to-r from-blue-100 via-blue-400 to-gray-600 shadow-lg text-white py-2 text-center">
          <p>&copy; {new Date().getFullYear()} i-MSConsulting | All rights reserved. Designed by i-MSConsulting.</p>
        </div>
      </div>
    </div>
  );
}
