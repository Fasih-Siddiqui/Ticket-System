"use client";
import React, { useState, useEffect } from "react";
import TicketModal from "../components/TicketModal";
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
import Link from "next/link";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tickets, setTickets] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/tickets");
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  // Calculate ticket counts
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(
    (ticket) => ticket.Status === "Open"
  ).length;
  const holdTickets = tickets.filter(
    (ticket) => ticket.Status === "Hold"
  ).length;
  const closeTickets = tickets.filter(
    (ticket) => ticket.Status === "Close"
  ).length;

  // Sidebar items
  const sidebarItems = [
    {
      icon: MdOutlineSpaceDashboard,
      label: "Dashboard",
      link: "/dashboard",
      active: false,
    },
    { icon: TiTicket, label: "Tickets", link: "/tickets", active: true },
    { icon: GoPeople, label: "Employee", link: "/employee" },
    { icon: HiOutlineCash, label: "Payroll", link: "/payroll" },
    { icon: CiTimer, label: "Timesheet", link: "/timesheet" },
    { icon: GoGoal, label: "Performance", link: "/performance" },
    { icon: GrMoney, label: "Finance", link: "/finance" },
    { icon: FaChalkboardTeacher, label: "Training", link: "/training" },
    { icon: RiAdminLine, label: "HR Admin Setup", link: "/hr-admin" },
    { icon: GoPersonAdd, label: "Recruitment", link: "/recruitment" },
    { icon: RiContractLine, label: "Contracts", link: "/contracts" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white to-blue-100">
      {/* Sidebar */}
      <div className="w-64 text-black bg-white p-5 shadow-md">
        <img src="/logo.png" alt="logo" className="w-40 mb-8" />
        <ul className="space-y-2">
          {sidebarItems.map((item, index) => (
            <li
              key={index}
              className={`p-3 rounded flex items-center space-x-4 cursor-pointer duration-300 ${
                item.active
                  ? "bg-sidebar-color text-white"
                  : "hover:bg-gray-100 hover:text-blue-700"
              }`}
            >
              <item.icon className="text-lg" />
              <Link href={item.link}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5">
        <div className="bg-white p-8 rounded-lg shadow-lg shadow-gray-700">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-black">Manage Ticket</h1>
            <div className="flex items-center space-x-4">
              <button
                className="bg-blue-700 text-white border border-blue-700 hover:bg-white hover:text-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:bg-blue-500 dark:text-white dark:hover:bg-white dark:hover:text-blue-500 dark:focus:ring-blue-900"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                <RiAddLargeFill />
              </button>
              <button
                onClick={() => {
                  router.push("/");
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 duration-300"
              >
                Logout
              </button>
            </div>
            <TicketModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>

          <div className="flex flex-wrap justify-between gap-5 mb-8">
            <div className="card flex-1 min-w-[240px] bg-cyan-card text-white p-5 shadow-xl shadow-gray-400 rounded-md">
              <h2 className="text-lg font-bold">Total Tickets</h2>
              <p className="text-2xl">{totalTickets}</p>
            </div>
            <div className="card flex-1 min-w-[240px] bg-sidebar-color text-white border border-sidebar-color p-5 shadow-xl shadow-gray-400 rounded-md">
              <h2 className="text-lg font-bold">Open Tickets</h2>
              <p className="text-2xl">{openTickets}</p>
            </div>
            <div className="card flex-1 min-w-[240px] bg-orange-card text-white p-5 shadow-xl shadow-gray-400 rounded-md">
              <h2 className="text-lg font-bold">Hold Tickets</h2>
              <p className="text-2xl">{holdTickets}</p>
            </div>
            <div className="card flex-1 min-w-[240px] bg-red-card text-white p-5 shadow-xl shadow-gray-400 rounded-md">
              <h2 className="text-lg font-bold">Closed Tickets</h2>
              <p className="text-2xl">{closeTickets}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-gray-200 shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.TicketCode}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      {ticket.TicketCode}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {ticket.Title}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {ticket.Employee}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {ticket.Priority}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {ticket.Date}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {ticket.CreatedBy}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {ticket.Status}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <Link href={`/tickets/${ticket.TicketCode}`}>
                        <button className="bg-blue-500 text-white px-2 py-1 rounded-md">
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
