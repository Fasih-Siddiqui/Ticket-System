import React, { useState } from "react";
import { TfiClose } from "react-icons/tfi";
import axios from "axios";

const TicketModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [employee, setEmployee] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Open");
  const [priority, setPriority] = useState("Low");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title === "" || employee === "" || date === "" || description === "") {
      alert("Error: Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login again");
        window.location.href = '/';
        return;
      }

      const response = await axios.post("http://localhost:8081/api/ticket", {
        title,
        employee,
        date,
        description,
        status,
        priority,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Ticket creation response:", response.data);
      alert("Ticket created successfully!");

      setTitle("");
      setEmployee("");
      setDate("");
      setDescription("");
      setStatus("Open");
      setPriority("Low");

      setLoading(false);
      onClose();

      window.location.reload();
    } catch (error) {
      console.error("Ticket creation error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        window.location.href = '/';
      } else {
        alert("Ticket creation failed");
      }
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-4xl w-full p-6">
        <div className="flex justify-between items-center pb-3">
          <h2 className="text-lg font-bold text-black">Create New Ticket</h2>
          <button
            className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center"
            onClick={onClose}
          >
            <TfiClose />
          </button>
        </div>
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter Ticket Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="employee"
              >
                Ticket for Employee
              </label>
              <select
                id="employee"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
              >
                <option value="">Select Employee</option>
                <option>Mubeen Javed</option>
                <option>Haseeb Hamid</option>
                <option>Fasih Siddiqui</option>
                {/* Add more options here */}
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="date"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="status"
              >
                Status
              </label>
              <select
                id="status"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Open</option>
                <option>Close</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="priority"
              >
                Priority
              </label>
              <select
                id="priority"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
          </div>
          <div className="col-span-2">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter description"
                rows="8"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading} // Disable button when loading
            >
              {loading ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketModal;
