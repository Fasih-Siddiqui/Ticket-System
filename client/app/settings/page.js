"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

// Simple Modal implementation for editing templates, custom fields, categories
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Ticket Configuration
  const [defaultPriority, setDefaultPriority] = useState("Medium");
  const [autoCloseDays, setAutoCloseDays] = useState(7);
  const [maxOpenTickets, setMaxOpenTickets] = useState(5);

  // Roles & Permissions
  const [allowEndUserTickets, setAllowEndUserTickets] = useState(true);
  const [roles, setRoles] = useState([
    { name: "Admin", assign: true, resolve: true, delete: true },
    { name: "Support Agent", assign: true, resolve: true, delete: false },
    { name: "End User", assign: false, resolve: false, delete: false },
  ]);

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [statusAlerts, setStatusAlerts] = useState(true);
  const [emailTemplateModal, setEmailTemplateModal] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState("Dear User,\nYour ticket has been created.");

  // UI Preferences
  const [darkMode, setDarkMode] = useState(false);
  const [logo, setLogo] = useState(null);
  const [themeColor, setThemeColor] = useState("#2563eb");

  // System Settings
  const [timezone, setTimezone] = useState("UTC");
  const [workingHours, setWorkingHours] = useState({ start: "09:00", end: "18:00" });
  const [ticketPrefix, setTicketPrefix] = useState("");

  // Custom Fields & Categories
  const [customFields, setCustomFields] = useState([
    { name: "Department" },
    { name: "Device Type" },
  ]);
  const [categories, setCategories] = useState([
    { name: "Hardware" },
    { name: "Software" },
    { name: "Network" },
  ]);
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [newField, setNewField] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // Security
  const [minPasswordLength, setMinPasswordLength] = useState(8);
  const [requireSpecialChar, setRequireSpecialChar] = useState(true);
  const [twoFA, setTwoFA] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState("");

  // Save success state for each section
  const [success, setSuccess] = useState({});

  // Handlers for modals
  const handleAddField = () => {
    if (newField.trim()) {
      setCustomFields([...customFields, { name: newField.trim() }]);
      setNewField("");
      setCustomFieldModal(false);
    }
  };
  const handleEditField = (idx, value) => {
    setCustomFields(customFields.map((f, i) => i === idx ? { name: value } : f));
  };
  const handleRemoveField = (idx) => {
    setCustomFields(customFields.filter((_, i) => i !== idx));
  };
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, { name: newCategory.trim() }]);
      setNewCategory("");
      setCategoryModal(false);
    }
  };
  const handleEditCategory = (idx, value) => {
    setCategories(categories.map((c, i) => i === idx ? { name: value } : c));
  };
  const handleRemoveCategory = (idx) => {
    setCategories(categories.filter((_, i) => i !== idx));
  };

  // Save handlers (simulate API call)
  const handleSave = (section) => {
    setSuccess((prev) => ({ ...prev, [section]: true }));
    setTimeout(() => setSuccess((prev) => ({ ...prev, [section]: false })), 2000);
  };

  // Active tab state
  const [activeTab, setActiveTab] = useState("Ticket Configuration");
  const sections = [
    "Ticket Configuration",
    "Roles & Permissions",
    "Notifications",
    "UI Preferences",
    "System Settings",
    "Custom Fields & Categories",
    "Security"
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-200 ${sidebarCollapsed ? 'ml-16' : 'ml-56'}`}>
        <div className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="mx-2 py-0.5">
            <div className="grid grid-cols-3 items-center">
              <div className="flex items-center ml-1">
                <Image src="/logo.png" alt="Logo" width={180} height={60} priority className="p-0 m-0" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-700 leading-tight font-sans tracking-tight drop-shadow-sm">
                  Settings
                </h1>
              </div>
              <div></div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="w-full flex flex-col items-center px-1 sm:px-2 md:px-2 lg:px-2 xl:px-2 2xl:px-2 mt-8">
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 w-full">
            {sections.map((section) => (
              <button
                key={section}
                className={`px-4 py-2 text-sm font-semibold rounded-t-md focus:outline-none transition-colors ${activeTab === section ? 'bg-white border-x border-t border-b-0 border-gray-200 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={() => setActiveTab(section)}
              >
                {section}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-b-md shadow-sm p-6 w-full min-h-[400px]">
            {activeTab === "Ticket Configuration" && (
              <form className="space-y-6 w-full" onSubmit={e => { e.preventDefault(); handleSave('ticket'); }}>
                <div>
                  <Label htmlFor="defaultPriority">Default Priority</Label>
                  <select id="defaultPriority" value={defaultPriority} onChange={e => setDefaultPriority(e.target.value)} className="border rounded px-2 py-1 w-full mt-1">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="autoCloseDays">Auto-close tickets after (days)</Label>
                  <Input id="autoCloseDays" type="number" min={1} value={autoCloseDays} onChange={e => setAutoCloseDays(e.target.value)} className="w-32" />
                </div>
                <div>
                  <Label htmlFor="maxOpenTickets">Max open tickets per user</Label>
                  <Input id="maxOpenTickets" type="number" min={1} value={maxOpenTickets} onChange={e => setMaxOpenTickets(e.target.value)} className="w-32" />
                </div>
                {success.ticket && <div className="text-green-600 font-medium">Saved!</div>}
                <div className="flex justify-end">
                  <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Save Changes</Button>
                </div>
              </form>
            )}
            {activeTab === "Roles & Permissions" && (
              <form className="space-y-6 w-full" onSubmit={e => { e.preventDefault(); handleSave('roles'); }}>
                <div className="mb-2 font-semibold">Manage User Roles</div>
                <div className="flex flex-col gap-2 mb-4">
                  {roles.map((role, idx) => (
                    <div key={role.name} className="flex items-center gap-2">
                      <span className="w-32 font-medium">{role.name}</span>
                      <span className="text-xs text-gray-500">Assign</span>
                      <input type="checkbox" checked={role.assign} onChange={() => {
                        setRoles(roles.map((r, i) => i === idx ? { ...r, assign: !r.assign } : r));
                      }} className="accent-blue-600" />
                      <span className="text-xs text-gray-500">Resolve</span>
                      <input type="checkbox" checked={role.resolve} onChange={() => {
                        setRoles(roles.map((r, i) => i === idx ? { ...r, resolve: !r.resolve } : r));
                      }} className="accent-blue-600" />
                      <span className="text-xs text-gray-500">Delete</span>
                      <input type="checkbox" checked={role.delete} onChange={() => {
                        setRoles(roles.map((r, i) => i === idx ? { ...r, delete: !r.delete } : r));
                      }} className="accent-blue-600" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <input id="allowEndUserTickets" type="checkbox" checked={allowEndUserTickets} onChange={e => setAllowEndUserTickets(e.target.checked)} className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="allowEndUserTickets" className="mb-0">Allow end-users to create tickets</Label>
                </div>
                <div className="mb-2 font-semibold">Permissions Matrix</div>
                <table className="w-full text-sm border rounded">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-1 border">Role</th>
                      <th className="p-1 border">Assign</th>
                      <th className="p-1 border">Resolve</th>
                      <th className="p-1 border">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => (
                      <tr key={role.name}>
                        <td className="p-1 border">{role.name}</td>
                        <td className="p-1 border text-center">{role.assign ? "✔️" : "—"}</td>
                        <td className="p-1 border text-center">{role.resolve ? "✔️" : "—"}</td>
                        <td className="p-1 border text-center">{role.delete ? "✔️" : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {success.roles && <div className="text-green-600 font-medium">Saved!</div>}
                <div className="flex justify-end">
                  <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Save Changes</Button>
                </div>
              </form>
            )}
            {activeTab === "Notifications" && (
              <form className="space-y-6 w-full" onSubmit={e => { e.preventDefault(); handleSave('notifications'); }}>
                <div className="flex items-center gap-2">
                  <input id="emailAlerts" type="checkbox" checked={emailAlerts} onChange={e => setEmailAlerts(e.target.checked)} className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="emailAlerts" className="mb-0">Email alerts for new ticket creation</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input id="statusAlerts" type="checkbox" checked={statusAlerts} onChange={e => setStatusAlerts(e.target.checked)} className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="statusAlerts" className="mb-0">Alerts for ticket status updates</Label>
                </div>
                <div>
                  <Button type="button" className="bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={() => setEmailTemplateModal(true)}>
                    Edit Email Templates
                  </Button>
                </div>
                {success.notifications && <div className="text-green-600 font-medium">Saved!</div>}
                <div className="flex justify-end">
                  <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Save Changes</Button>
                </div>
              </form>
            )}
            {activeTab === "UI Preferences" && (
              <form className="space-y-6 w-full" onSubmit={e => { e.preventDefault(); handleSave('ui'); }}>
                <div className="flex items-center gap-2">
                  <input id="darkMode" type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="darkMode" className="mb-0">Dark Mode</Label>
                </div>
                <div>
                  <Label htmlFor="logoUpload">Company Logo</Label>
                  <Input id="logoUpload" type="file" accept="image/*" onChange={e => setLogo(e.target.files[0])} className="w-full" />
                  {logo && <div className="mt-2 text-sm text-gray-600">Selected: {logo.name}</div>}
                </div>
                <div>
                  <Label htmlFor="themeColor">Primary Theme Color</Label>
                  <Input id="themeColor" type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="w-16 h-10 p-0 border-none" />
                </div>
                {success.ui && <div className="text-green-600 font-medium">Saved!</div>}
                <div className="flex justify-end">
                  <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Save Changes</Button>
                </div>
              </form>
            )}
            {activeTab === "System Settings" && (
              <form className="space-y-6 w-full" onSubmit={e => { e.preventDefault(); handleSave('system'); }}>
                <div>
                  <Label htmlFor="timezone">Company Timezone</Label>
                  <select id="timezone" value={timezone} onChange={e => setTimezone(e.target.value)} className="border rounded px-2 py-1 w-full mt-1">
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                    <option value="Asia/Dubai">Asia/Dubai</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label htmlFor="workingStart">Working Hours Start</Label>
                    <Input id="workingStart" type="time" value={workingHours.start} onChange={e => setWorkingHours({ ...workingHours, start: e.target.value })} className="w-32" />
                  </div>
                  <div>
                    <Label htmlFor="workingEnd">Working Hours End</Label>
                    <Input id="workingEnd" type="time" value={workingHours.end} onChange={e => setWorkingHours({ ...workingHours, end: e.target.value })} className="w-32" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="ticketPrefix">Ticket ID Prefix</Label>
                  <Input id="ticketPrefix" type="text" value={ticketPrefix} onChange={e => setTicketPrefix(e.target.value)} className="w-32" />
                </div>
                {success.system && <div className="text-green-600 font-medium">Saved!</div>}
                <div className="flex justify-end">
                  <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Save Changes</Button>
                </div>
              </form>
            )}
            {activeTab === "Custom Fields & Categories" && (
              <div className="space-y-8 w-full">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">Custom Ticket Fields</div>
                    <Button type="button" size="sm" className="bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={() => setCustomFieldModal(true)}>
                      Add Field
                    </Button>
                  </div>
                  <ul className="list-disc ml-6 text-sm">
                    {customFields.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 mb-1">
                        <input
                          type="text"
                          value={f.name}
                          onChange={e => handleEditField(i, e.target.value)}
                          className="border rounded px-2 py-1 text-sm w-40"
                        />
                        <Button type="button" size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleRemoveField(i)}>Remove</Button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">Ticket Categories</div>
                    <Button type="button" size="sm" className="bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={() => setCategoryModal(true)}>
                      Add Category
                    </Button>
                  </div>
                  <ul className="list-disc ml-6 text-sm">
                    {categories.map((c, i) => (
                      <li key={i} className="flex items-center gap-2 mb-1">
                        <input
                          type="text"
                          value={c.name}
                          onChange={e => handleEditCategory(i, e.target.value)}
                          className="border rounded px-2 py-1 text-sm w-40"
                        />
                        <Button type="button" size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleRemoveCategory(i)}>Remove</Button>
                      </li>
                    ))}
                  </ul>
                </div>
                {success.custom && <div className="text-green-600 font-medium">Saved!</div>}
                <div className="flex justify-end">
                  <Button type="button" className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => handleSave('custom')}>Save Changes</Button>
                </div>
              </div>
            )}
            {activeTab === "Security" && (
              <form className="space-y-6 w-full" onSubmit={e => { e.preventDefault(); handleSave('security'); }}>
                <div>
                  <Label htmlFor="minPasswordLength">Password Policy</Label>
                  <div className="flex gap-2 items-center mt-1">
                    <span className="text-sm">Min Length</span>
                    <Input id="minPasswordLength" type="number" min={6} value={minPasswordLength} onChange={e => setMinPasswordLength(e.target.value)} className="w-20" />
                    <span className="text-sm">Require Special Characters</span>
                    <input id="requireSpecialChar" type="checkbox" checked={requireSpecialChar} onChange={e => setRequireSpecialChar(e.target.checked)} className="accent-blue-600 w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input id="twoFA" type="checkbox" checked={twoFA} onChange={e => setTwoFA(e.target.checked)} className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="twoFA" className="mb-0">Enable Two-Factor Authentication (2FA)</Label>
                </div>
                <div>
                  <Label htmlFor="ipWhitelist">Admin IP Whitelist</Label>
                  <Input id="ipWhitelist" type="text" value={ipWhitelist} onChange={e => setIpWhitelist(e.target.value)} placeholder="e.g. 192.168.1.1, 10.0.0.2" />
                </div>
                {success.security && <div className="text-green-600 font-medium">Saved!</div>}
                <div className="flex justify-end">
                  <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Save Changes</Button>
                </div>
              </form>
            )}
          </div>
        </div>
        {/* Modals */}
        <Modal open={emailTemplateModal} onClose={() => setEmailTemplateModal(false)} title="Edit Email Template">
          <textarea
            className="border rounded w-full p-2 font-mono text-sm mb-4"
            rows={8}
            value={emailTemplate}
            onChange={e => setEmailTemplate(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button onClick={() => setEmailTemplateModal(false)} className="bg-blue-600 text-white hover:bg-blue-700">Save</Button>
            <Button variant="outline" onClick={() => setEmailTemplateModal(false)}>Cancel</Button>
          </div>
        </Modal>
        <Modal open={customFieldModal} onClose={() => setCustomFieldModal(false)} title="Add Custom Field">
          <Input
            type="text"
            placeholder="Field Name"
            value={newField}
            onChange={e => setNewField(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button onClick={handleAddField} className="bg-blue-600 text-white hover:bg-blue-700">Add</Button>
            <Button variant="outline" onClick={() => setCustomFieldModal(false)}>Cancel</Button>
          </div>
        </Modal>
        <Modal open={categoryModal} onClose={() => setCategoryModal(false)} title="Add Ticket Category">
          <Input
            type="text"
            placeholder="Category Name"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button onClick={handleAddCategory} className="bg-blue-600 text-white hover:bg-blue-700">Add</Button>
            <Button variant="outline" onClick={() => setCategoryModal(false)}>Cancel</Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
