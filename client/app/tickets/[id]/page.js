"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const FormDataPage = () => {
  const [formData, setFormData] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");

  

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/tickets");
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, []);

  const handleCommentSubmit = (e, ticketCode) => {
    e.preventDefault();

    if (newComment.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }

    setComments((prevComments) => ({
      ...prevComments,
      [ticketCode]: [...(prevComments[ticketCode] || []), newComment],
    }));

    setNewComment("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100 p-5">
      <div className="bg-white p-8 rounded-lg shadow-lg shadow-gray-700">
        <h1 className="text-2xl font-bold text-black mb-8">Form Data</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-gray-200 shadow">
            <thead>
              <tr className="bg-gray-100">
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {formData.map((ticket) => (
                <tr
                  key={ticket.TicketCode}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="px-6 py-3 whitespace-nowrap">
                    {ticket.Description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {formData.map((ticket) => (
          <div
            key={ticket.TicketCode}
            className="mt-8 bg-gray-100 p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-bold text-black mb-4">
              {ticket.Title}
            </h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-black">Comments</h3>
              <ul className="list-disc pl-5">
                {(comments[ticket.TicketCode] || []).map((comment, index) => (
                  <li key={index} className="text-gray-700">
                    {comment}
                  </li>
                ))}
              </ul>
            </div>
            <form onSubmit={(e) => handleCommentSubmit(e, ticket.TicketCode)}>
              <textarea
                className="w-full p-2 border text-black border-gray-300 rounded mb-4"
                placeholder="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Comment
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormDataPage;
