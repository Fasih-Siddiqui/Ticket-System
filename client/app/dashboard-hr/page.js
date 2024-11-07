// pages/index.js
"use client";
import React from "react";
import TicketModal from "../components/TicketModal";
import { useState } from "react";
import { RiAddLargeFill } from "react-icons/ri";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { TiTicket } from "react-icons/ti";
import { GoPeople } from "react-icons/go";
import { HiOutlineCash } from "react-icons/hi";
import { CiTimer } from "react-icons/ci";
import { GoGoal } from "react-icons/go";
import { GrMoney } from "react-icons/gr";
import { FaChalkboardTeacher } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { GoPersonAdd } from "react-icons/go";
import { RiContractLine } from "react-icons/ri";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white to-blue-100">
      {/* Sidebar */}
      <div className="w-64 text-black bg-white p-5 shadow-md">
        <div className="text-lg font-bold mb-5">i-MSConsulting</div>
        <ul>
          <ul className="flex space-x-8">
            <li className="mb-2 sidebar hover:bg-sidebar-color hover:text-white duration-300 p-3 rounded flex items-center">
              <MdOutlineSpaceDashboard /> &nbsp;Dashboard
            </li>
          </ul>
          <ul className="flex space-x-8">
            <li className="mb-2 sidebar bg-sidebar-color text-white duration-300 p-3 rounded flex items-center">
              <TiTicket /> &nbsp;Tickets
            </li>
          </ul>
          <ul className="flex space-x-8">
            <li className="mb-2 sidebar hover:bg-sidebar-color hover:text-white duration-300 p-3 rounded flex items-center">
              <GoPeople />
              &nbsp;Employee
            </li>
          </ul>
          <ul className="flex space-x-8">
            <li className="mb-2 sidebar hover:bg-sidebar-color hover:text-white duration-300 p-3 rounded flex items-center">
              <HiOutlineCash /> &nbsp;Payroll
            </li>
          </ul>
          <ul className="flex space-x-8">
            <li className="mb-2 sidebar hover:bg-sidebar-color hover:text-white duration-300 p-3 rounded flex items-center">
              <CiTimer />
              &nbsp;Timesheet
            </li>
          </ul>
          <ul className="flex space-x-8">
            <li className="mb-2 sidebar hover:bg-sidebar-color hover:text-white duration-300 p-3 rounded flex items-center">
              <GoGoal /> &nbsp;Performance
            </li>
          </ul>
          <ul className="flex space-x-8">
            <li className="mb-2 sidebar hover:bg-sidebar-color hover:text-white duration-300 p-3 rounded flex items-center">
              <GrMoney /> &nbsp;Finance
            </li>
          </ul>
          <ul className="flex space-x-8">
            <li className="mb-2 sidebar hover:bg-sidebar-color hover:text-white duration-300 p-3 rounded flex items-center">
              <FaChalkboardTeacher /> &nbsp;Training
            </li>
          </ul>
          <ul className="flex space-x-8">
            <li className="mb-2 sidebar hover:bg-sidebar-color hover:text-white duration-300 p-3 rounded flex items-center">
              <RiAdminLine /> &nbsp; HR Admin Setup
            </li>
          </ul>
          <ul className="flex space-x-8">
            <li className="mb-2 sidebar hover:bg-sidebar-color hover:text-white duration-300 p-3 rounded flex items-center">
              <GoPersonAdd /> &nbsp;Recruitment
            </li>
          </ul>
          <ul className="flex space-x-8">
            <li className="mb-2 sidebar hover:bg-sidebar-color hover:text-white duration-300 p-3 rounded flex items-center">
              <RiContractLine />
              &nbsp;Contracts
            </li>
          </ul>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5">
        <div className="bg-white p-8 rounded-lg shadow-lg shadow-gray-700">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-black">Manage Ticket</h1>
            <button
              className="bg-blue-700 text-white border border-blue-700 hover:bg-white hover:text-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:bg-blue-500 dark:text-white dark:hover:bg-white dark:hover:text-blue-500 dark:focus:ring-blue-900"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <RiAddLargeFill />
            </button>
            <TicketModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
          <div class="flex flex-wrap justify-between gap-5 mb-8">
            <div class="card flex-1 min-w-[240px] bg-cyan-card text-white p-5 shadow-xl shadow-gray-400 rounded-md">
              <h2 class="text-lg font-bold">Total Ticket</h2>
              <p class="text-2xl">0</p>
            </div>
            <div class="card flex-1 min-w-[240px] bg-sidebar-color text-white border border-sidebar-color p-5 shadow-xl shadow-gray-400 rounded-md">
              <h2 class="text-lg font-bold">Open Ticket</h2>
              <p class="text-2xl">0</p>
            </div>
            <div class="card flex-1 min-w-[240px] bg-orange-card text-white p-5 shadow-xl shadow-gray-400 rounded-md">
              <h2 class="text-lg font-bold">Hold Ticket</h2>
              <p class="text-2xl">0</p>
            </div>
            <div class="card flex-1 min-w-[240px] bg-red-card text-white p-5 shadow-xl shadow-gray-400 rounded-md">
              <h2 class="text-lg font-bold">Close Ticket</h2>
              <p class="text-2xl">0</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md shadow-gray-400 ">
            
            <table className="w-full table-auto text-black">
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
  );
};

export default Dashboard;
