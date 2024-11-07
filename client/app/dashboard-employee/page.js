// pages/index.js

import React from "react";

const Home = () => {
  return (
    <div className="text-black">
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white p-5 shadow-md">
          <div className="text-lg font-bold mb-5">i-MSConsulting</div>
          <ul>
            <li className="mb-2">Dashboard</li>
            <li className="mb-2">Staff</li>
            <li className="mb-2">Employee</li>
            <li className="mb-2">Payroll</li>
            <li className="mb-2">Timesheet</li>
            <li className="mb-2">Performance</li>
            <li className="mb-2">Finance</li>
            <li className="mb-2">Training</li>
            <li className="mb-2">HR Admin Setup</li>
            <li className="mb-2">Recruitment</li>
            <li className="mb-2">Contracts</li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-5">
          <div className="bg-white p-5 shadow-md rounded-md mb-5">
            <div className="flex justify-between items-center mb-5">
              <h1 className="text-2xl font-bold">Manage Ticket</h1>
              <button className="bg-blue-500 text-white p-2 rounded-md">
                +
              </button>
            </div>
            <div className="grid grid-cols-4 gap-5 mb-5">
              <div className="bg-white p-5 shadow-md rounded-md">
                <h2 className="text-lg font-bold">Total Ticket</h2>
                <p className="text-2xl">0</p>
              </div>
              <div className="bg-white p-5 shadow-md rounded-md">
                <h2 className="text-lg font-bold">Open Ticket</h2>
                <p className="text-2xl">0</p>
              </div>
              <div className="bg-white p-5 shadow-md rounded-md">
                <h2 className="text-lg font-bold">Hold Ticket</h2>
                <p className="text-2xl">0</p>
              </div>
              <div className="bg-white p-5 shadow-md rounded-md">
                <h2 className="text-lg font-bold">Close Ticket</h2>
                <p className="text-2xl">0</p>
              </div>
            </div>
            <div className="bg-white p-5 shadow-md rounded-md">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2">New</th>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Ticket Code</th>
                    <th className="px-4 py-2">Employee</th>
                    <th className="px-4 py-2">Priority</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Created By</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 text-center" colSpan="9">
                      No entries found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
