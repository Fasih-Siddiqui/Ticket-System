"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function SettingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Example settings state
  const [notificationEmail, setNotificationEmail] = useState("");
  const [ticketPrefix, setTicketPrefix] = useState("");
  const [autoAssign, setAutoAssign] = useState(false);
  const [defaultRole, setDefaultRole] = useState("employee");
  const [success, setSuccess] = useState("");
  const [autoCloseDays, setAutoCloseDays] = useState(7);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [workingHoursStart, setWorkingHoursStart] = useState("09:00");
  const [workingHoursEnd, setWorkingHoursEnd] = useState("18:00");
  const [companyName, setCompanyName] = useState("");
  const [supportContact, setSupportContact] = useState("");
  const [theme, setTheme] = useState("system");
  const [companyLogo, setCompanyLogo] = useState(null);
  const [ticketIdType, setTicketIdType] = useState("sequential");
  const [defaultSLA, setDefaultSLA] = useState("");
  const [defaultPriority, setDefaultPriority] = useState("normal");
  const [defaultAssetType, setDefaultAssetType] = useState("");
  const [defaultCategory, setDefaultCategory] = useState("");
  const [maxOpenTickets, setMaxOpenTickets] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess("Settings saved successfully!");
    // TODO: Save settings to backend
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-200 ${sidebarCollapsed ? "ml-16" : "ml-56"}`}>
        <div className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 shadow-sm border-b border-gray-200">
          <div className="mx-2 py-0.5">
            <div className="grid grid-cols-3 items-center">
              <div className="flex items-center ml-1">
                <Image src="/logo.png" alt="i-MSConsulting Logo" width={220} height={200} priority className="p-0 m-0" />
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
        <div className="w-full py-8 flex-grow px-4 md:px-8 lg:px-18">
          {/* System-wide Default Ticket Settings and Options */}
          <Card className="shadow-sm mb-8">
            <CardHeader className="border-b">
              <CardTitle className="text-xl font-bold">System-wide Default Ticket Settings and Options</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Ticket IDs */}
                <div>
                  <Label className="font-semibold">Ticket IDs:</Label>
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="ticketIdType" value="sequential" checked={ticketIdType === "sequential"} onChange={() => setTicketIdType("sequential")} className="accent-blue-600" />
                      Sequential
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="ticketIdType" value="random" checked={ticketIdType === "random"} onChange={() => setTicketIdType("random")} className="accent-blue-600" />
                      Random
                    </label>
                  </div>
                </div>
                {/* Default SLA */}
                <div>
                  <Label htmlFor="defaultSLA">Default SLA<span className="text-red-500">*</span></Label>
                  <select id="defaultSLA" name="defaultSLA" value={defaultSLA} onChange={e => setDefaultSLA(e.target.value)} className="border rounded px-2 py-1 w-full mt-1" required>
                    <option value="">Select SLA</option>
                    <option value="48h">Default SLA (48 hrs - Active)</option>
                    <option value="24h">24 hrs</option>
                    <option value="72h">72 hrs</option>
                  </select>
                </div>
                {/* Default Priority */}
                <div>
                  <Label htmlFor="defaultPriority">Default Priority<span className="text-red-500">*</span></Label>
                  <select id="defaultPriority" name="defaultPriority" value={defaultPriority} onChange={e => setDefaultPriority(e.target.value)} className="border rounded px-2 py-1 w-full mt-1" required>
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                {/* Default Asset Type */}
                <div>
                  <Label htmlFor="defaultAssetType">Default Asset Type<span className="text-red-500">*</span></Label>
                  <select id="defaultAssetType" name="defaultAssetType" value={defaultAssetType} onChange={e => setDefaultAssetType(e.target.value)} className="border rounded px-2 py-1 w-full mt-1" required>
                    <option value="">Select Asset Type</option>
                    <option value="workstation">Workstation</option>
                    <option value="printer">Printer</option>
                    <option value="router">Router</option>
                    <option value="server">Server</option>
                    <option value="network">Network</option>
                  </select>
                </div>
                {/* Default Category */}
                <div>
                  <Label htmlFor="defaultCategory">Default Category</Label>
                  <select id="defaultCategory" name="defaultCategory" value={defaultCategory} onChange={e => setDefaultCategory(e.target.value)} className="border rounded px-2 py-1 w-full mt-1">
                    <option value="">— None —</option>
                    <option value="hardware">Hardware</option>
                    <option value="software">Software</option>
                    <option value="network">Network</option>
                  </select>
                </div>
                {/* Maximum Open Tickets */}
                <div>
                  <Label htmlFor="maxOpenTickets">Maximum Open Tickets</Label>
                  <div className="flex items-center gap-2">
                    <Input id="maxOpenTickets" name="maxOpenTickets" type="number" min={0} value={maxOpenTickets} onChange={e => setMaxOpenTickets(e.target.value)} className="w-32" />
                    <span className="text-gray-500 text-sm">per email/user</span>
                  </div>
                </div>
                {/* Agent Collision Avoidance Duration */}
                <div>
                  <Label htmlFor="agentCollision">Agent Collision Avoidance Duration (min)</Label>
                  <Input id="agentCollision" name="agentCollision" type="number" min={0} placeholder="0" className="w-32" />
                </div>
                {/* Human Verification */}
                <div className="flex items-center gap-2">
                  <input id="humanVerification" name="humanVerification" type="checkbox" className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="humanVerification" className="mb-0">Human Verification (CAPTCHA)</Label>
                </div>
                {/* Claim on Response */}
                <div className="flex items-center gap-2">
                  <input id="claimOnResponse" name="claimOnResponse" type="checkbox" className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="claimOnResponse" className="mb-0">Claim on Response</Label>
                </div>
                {/* Assigned Tickets */}
                <div className="flex items-center gap-2">
                  <input id="assignedTickets" name="assignedTickets" type="checkbox" className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="assignedTickets" className="mb-0">Hide assigned tickets in 'Open' queue</Label>
                </div>
                {/* Answered Tickets */}
                <div className="flex items-center gap-2">
                  <input id="answeredTickets" name="answeredTickets" type="checkbox" className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="answeredTickets" className="mb-0">Move answered tickets to 'Answered' queue</Label>
                </div>
                {/* Staff Identity Masking */}
                <div className="flex items-center gap-2">
                  <input id="staffIdentityMasking" name="staffIdentityMasking" type="checkbox" className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="staffIdentityMasking" className="mb-0">Staff Identity Masking</Label>
                </div>
                {/* Enable HTML Ticket Thread */}
                <div className="flex items-center gap-2">
                  <input id="enableHtmlThread" name="enableHtmlThread" type="checkbox" className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="enableHtmlThread" className="mb-0">Enable HTML Ticket Thread</Label>
                </div>
                {/* Allow Client Updates */}
                <div className="flex items-center gap-2">
                  <input id="allowClientUpdates" name="allowClientUpdates" type="checkbox" className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="allowClientUpdates" className="mb-0">Allow Client Updates</Label>
                </div>
                {/* Auto-close Overdue Tickets Timeout */}
                <div>
                  <Label htmlFor="autoCloseOverdue">Auto-close Overdue Tickets Timeout (hours)</Label>
                  <Input id="autoCloseOverdue" name="autoCloseOverdue" type="number" min={0} placeholder="0" className="w-32" />
                </div>
                {/* Auto-close Resolution Message */}
                <div>
                  <Label htmlFor="autoCloseResolution">Auto-close Resolution Message</Label>
                  <Input id="autoCloseResolution" name="autoCloseResolution" type="text" placeholder="This ticket was automatically closed because it was overdue." />
                </div>
                {success && <div className="text-green-600 font-medium">{success}</div>}
                <div className="flex justify-end">
                  <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Save Settings</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Time Settings (Global) */}
          <Card className="shadow-sm mb-8">
            <CardHeader className="border-b">
              <CardTitle className="text-xl font-bold">Time Settings (Global)</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-6">
                <div>
                  <Label htmlFor="chargeInterval">Charge Interval (minutes)</Label>
                  <Input id="chargeInterval" name="chargeInterval" type="number" min={1} placeholder="e.g. 1" className="w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <input id="enableTimeCounter" name="enableTimeCounter" type="checkbox" className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="enableTimeCounter" className="mb-0">Enable time counter for ticket threads</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input id="manualTimeEntry" name="manualTimeEntry" type="checkbox" className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="manualTimeEntry" className="mb-0">Allow manual time entry</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input id="manualTimeEntryOthers" name="manualTimeEntryOthers" type="checkbox" className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="manualTimeEntryOthers" className="mb-0">Allow manual time entry by other staff</Label>
                </div>
                <div>
                  <Label className="font-semibold">Round billable time:</Label>
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="roundBillableTime" value="no-rounding" className="accent-blue-600" />
                      Calculate billable time without rounding
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="roundBillableTime" value="round-each" className="accent-blue-600" />
                      Round each billable time separately
                    </label>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card className="shadow-sm mb-8">
            <CardHeader className="border-b">
              <CardTitle className="text-xl font-bold">Attachments</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-6">
                <div className="flex items-center gap-2">
                  <input id="allowAttachments" name="allowAttachments" type="checkbox" className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="allowAttachments" className="mb-0">Allow Attachments</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input id="emailedApiAttachments" name="emailedApiAttachments" type="checkbox" className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="emailedApiAttachments" className="mb-0">Allow attachments via Email/API</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input id="webAttachments" name="webAttachments" type="checkbox" className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="webAttachments" className="mb-0">Allow attachments via Web Portal</Label>
                </div>
                <div>
                  <Label htmlFor="maxUserFiles">Max. User File Uploads</Label>
                  <Input id="maxUserFiles" name="maxUserFiles" type="number" min={0} className="w-32" />
                </div>
                <div>
                  <Label htmlFor="maxStaffFiles">Max. Staff File Uploads</Label>
                  <Input id="maxStaffFiles" name="maxStaffFiles" type="number" min={0} className="w-32" />
                </div>
                <div>
                  <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
                  <Input id="maxFileSize" name="maxFileSize" type="number" min={0} className="w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <input id="ticketResponseFiles" name="ticketResponseFiles" type="checkbox" className="accent-blue-600 w-4 h-4" />
                  <Label htmlFor="ticketResponseFiles" className="mb-0">Include ticket response files in user emails</Label>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Accepted File Types */}
          <Card className="shadow-sm mb-8">
            <CardHeader className="border-b">
              <CardTitle className="text-xl font-bold">Accepted File Types</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-6">
                <div>
                  <div className="font-semibold mb-1">Accepted File Types: <span className="font-normal text-gray-600">Limit the type of files users are allowed to submit.</span></div>
                  <div className="text-sm text-gray-500 mb-2">Enter allowed file extensions separated by a comma. e.g. <code>.doc, .pdf</code>. To accept all files enter wildcard <code>.*</code> (NOT Recommended)</div>
                  <textarea
                    id="acceptedFileTypes"
                    name="acceptedFileTypes"
                    rows={3}
                    className="border rounded px-2 py-2 w-full font-mono text-sm"
                    placeholder=".doc,.pdf,.jpg,.jpeg,.gif,.png,.xls,.docx,.xlsx,.txt"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">Save Changes</Button>
                  <Button type="button" variant="outline" className="border-gray-300 text-gray-700 bg-white hover:bg-gray-100">Reset Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
