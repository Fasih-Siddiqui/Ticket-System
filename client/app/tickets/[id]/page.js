"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageCircle, Clock, AlertCircle, Edit, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

const TicketDetails = ({ params }) => {
  const [ticket, setTicket] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedTicket, setEditedTicket] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const ticketCode = params.id;
  const router = useRouter();

  const formatDateTime = (date) => {
    if (!date) return '';
    // If date is already a number (timestamp), use it directly
    if (typeof date === 'number') {
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }
    // If date is a string, try to parse as ISO or as number
    if (typeof date === 'string') {
      // If it's a numeric string (timestamp)
      if (/^\d+$/.test(date)) {
        return new Date(Number(date)).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      }
      // If it's an ISO string, parse as UTC
      if (date.match(/\d{4}-\d{2}-\d{2}T/)) {
        // Always use UTC for ISO strings
        return new Date(date).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'UTC',
        });
      }
    }
    // Fallback
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
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

    const fetchTicketDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/tickets/${ticketCode}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setTicket(response.data);
        setEditedTicket(response.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          router.push('/');
        } else {
          setError(err.response?.data?.error || "Failed to fetch ticket details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketCode, router]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/tickets/${ticketCode}/comments`,
        {
          commentText: newComment.trim()
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Use the server's time for the comment, parsed as UTC and shown in local time
      const serverDate = response.data.comment.date;
      let localDate = serverDate;
      // If the serverDate is an ISO string, parse and store as a Date object for immediate display
      if (typeof serverDate === 'string' && serverDate.match(/\d{4}-\d{2}-\d{2}T/)) {
        localDate = new Date(serverDate.endsWith('Z') ? serverDate : serverDate + 'Z');
      }

      setTicket(prevTicket => ({
        ...prevTicket,
        comments: [
          {
            CommentID: response.data.comment.id,
            CommentText: response.data.comment.text,
            CommentedBy: response.data.comment.commentedBy,
            CommentDate: localDate, // store as Date object for immediate correct display
            TicketCode: response.data.comment.ticketCode
          },
          ...(prevTicket.comments || [])
        ]
      }));

      setNewComment("");
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Comment error:", err);
      // Only logout for authentication errors
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/');
      } else {
        // Show the error message from the server or a default message
        setError(err.response?.data?.error || "There was an error submitting your comment. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_BASE_URL}/api/tickets/${ticketCode}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      // Check user role and redirect accordingly
      if (userData.role === 'admin') {
        router.push('/dashboard-admin');
      } else if (userData.role === 'support') {
        router.push('/dashboard-support');
      } else {
        router.push('/dashboard-employee');
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        router.push('/');
      } else {
        setError("Failed to delete ticket");
      }
    }
  };

  const handleBackClick = () => {
    if (userData?.role === 'admin') {
      router.push('/dashboard-admin');
    } else if (userData?.role === 'support') {
      router.push('/dashboard-support');
    } else {
      router.push('/dashboard-employee');
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/tickets/${ticketCode}`,
        {
          title: editedTicket.Title,
          description: editedTicket.Description,
          status: editedTicket.Status,
          priority: editedTicket.Priority
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Fetch updated ticket details
      const response = await axios.get(
        `${API_BASE_URL}/api/tickets/${ticketCode}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setTicket(response.data);
      setEditedTicket(response.data);
      setEditDialogOpen(false);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        router.push('/');
      } else {
        setError("Failed to update ticket");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-400 to-gray-600 shadow-lg">
        <div className="w-full py-4">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center">
              <Image src="/logo.png" alt="Logo" width={220} height={60} priority className="mr-4" />
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-100 text-gray-600 font-semibold"
                onClick={handleBackClick}
              >
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-100 text-gray-600 font-semibold"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {userData?.role === 'admin' && (
          <div className="mb-6 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Ticket
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Ticket
            </Button>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : ticket ? (
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="border-b">
                <CardTitle className="text-2xl font-bold">{ticket.Title}</CardTitle>
                <div className="flex gap-4 items-center mt-2">
                  <span className="text-sm text-gray-500">#{ticket.TicketCode}</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${ticket.Status === 'Open' ? 'bg-blue-100 text-blue-800' : 
                      ticket.Status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      ticket.Status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {ticket.Status}
                  </span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${ticket.Priority === 'High' ? 'bg-red-100 text-red-800' : 
                      ticket.Priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'}`}>
                    {ticket.Priority}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap mb-6">{ticket.Description}</p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 border-t pt-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Created: {formatDateTime(ticket.Date)}</span>                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>Created by: {ticket.CreatedBy}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Comments</h2>
              </div>
              
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        className="bg-blue-600 text-white hover:bg-blue-700" 
                        disabled={loading || !newComment.trim()}
                      >
                        Post Comment
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {ticket.comments?.map((comment) => (
                  <Card key={comment.CommentID} className="shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-3 pb-3 border-b">
                        <div className="font-semibold text-blue-600">{comment.CommentedBy}</div>
                        <div className="text-sm text-gray-500">
                        {formatDateTime(comment.CommentDate)}                        </div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.CommentText}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Ticket not found</AlertDescription>
          </Alert>
        )}

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editedTicket?.Title || ""}
                  onChange={(e) =>
                    setEditedTicket({ ...editedTicket, Title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedTicket?.Description || ""}
                  onChange={(e) =>
                    setEditedTicket({
                      ...editedTicket,
                      Description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editedTicket?.Status || ""}
                  onValueChange={(value) =>
                    setEditedTicket({ ...editedTicket, Status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={editedTicket?.Priority || ""}
                  onValueChange={(value) =>
                    setEditedTicket({ ...editedTicket, Priority: value })
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
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Ticket</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this ticket? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TicketDetails;
