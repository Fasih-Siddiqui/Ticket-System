import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const result = dotenv.config({ path: path.join(__dirname, '.env') });
if (result.error) {
    console.log('Error loading .env file:', result.error);
} else {
    console.log('Environment variables loaded successfully');
    console.log('Loaded EMAIL_USER:', process.env.EMAIL_USER);
    console.log('Loaded EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
}

import express from "express";
import cors from "cors";
import mssql from "mssql";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { 
  sendTicketCreationNotification,
  sendTicketAssignmentNotification,
  sendTicketResolutionNotification,
  sendTicketClosureNotification,
  sendCommentNotification
} from './utils/emailService.js';

const JWT_SECRET = "your-secret-key"; // In production, use environment variable
const app = express();
app.use(cors({ 
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// development config

const config = {
  user: "sa",
  password: "sap123",
  server: "MUBEEN-LENOVO-L",
  database: "TicketSystem",
  port: 1433,
  options: { encrypt: false },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 15000,
  },
};

// final config

// const config = {
//   user: "sa",
//   password: "s@dm!n321",
//   server: "b1sql",
//   database: "TicketSystem",
//   port: 1433,
//   options: { encrypt: false },
//   pool: {
//     max: 10,
//     min: 0,
//     idleTimeoutMillis: 15000,
//   },
// };

const pool = new mssql.ConnectionPool(config);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    console.log("Received token:", token);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({ error: "Invalid token." });
  }
};

// Test database connection endpoint
app.get("/api/test-db", async (req, res) => {
  try {
    // Test 1: Basic Connection
    console.log("Testing database connection...");
    const connection = await pool.connect();
    console.log("Database connection successful!");

    // Test 2: Simple Query
    console.log("Testing simple query...");
    const testQuery = await connection.request().query('SELECT @@VERSION as version');
    console.log("Query successful!");

    // Test 3: Table Access
    console.log("Testing table access...");
    const tablesQuery = await connection.request()
      .query(`
        SELECT TOP 1 * FROM Users;
        SELECT TOP 1 * FROM Tickets;
        SELECT TOP 1 * FROM Comments;
      `);
    
    const response = {
      status: "Success",
      connection: "Connected successfully to SQL Server",
      sqlVersion: testQuery.recordset[0].version,
      tables: {
        users: tablesQuery.recordsets[0].length > 0 ? "Accessible" : "No records or not accessible",
        tickets: tablesQuery.recordsets[1].length > 0 ? "Accessible" : "No records or not accessible",
        comments: tablesQuery.recordsets[2].length > 0 ? "Accessible" : "No records or not accessible"
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Database test failed:", error);
    res.status(500).json({
      status: "Error",
      message: "Database connection test failed",
      error: error.message,
      details: {
        code: error.code,
        state: error.state,
        serverName: error.server,
        connectionConfig: {
          server: config.server,
          database: config.database,
          port: config.port
        }
      }
    });
  }
});

// Existing signup endpoint
app.post("/api/signup", async (req, res) => {
  const { fullname, email, username, password, role } = req.body;

  if (!fullname || !email || !username || !password || !role) {
    return res.status(400).json({ error: "Please fill in all required fields" });
  }

  try {
    const connection = await pool.connect();
    
    // Check if username already exists
    const checkUser = await connection
      .request()
      .input("username", mssql.VarChar, username)
      .query("SELECT Username FROM Users WHERE Username = @username");

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Check if email already exists
    const checkEmail = await connection
      .request()
      .input("email", mssql.VarChar, email)
      .query("SELECT Email FROM Users WHERE Email = @email");

    if (checkEmail.recordset.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const result = await connection
      .request()
      .input("fullname", mssql.VarChar, fullname)
      .input("email", mssql.VarChar, email)
      .input("username", mssql.VarChar, username)
      .input("password", mssql.VarChar, password)
      .input("role", mssql.VarChar, role)
      .query(
        "INSERT INTO Users (Fullname, Email, Username, Password, Role) VALUES (@fullname, @email, @username, @password, @role)"
      );

    if (result.rowsAffected.length > 0) {
      res.status(201).json({ message: "User created successfully" });
    } else {
      res.status(500).json({ error: "User creation failed" });
    }
  } catch (error) {
    console.error("User creation error:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      details: error.message 
    });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const connection = await pool.connect();
    
    // First check if username exists
    const userCheck = await connection
      .request()
      .input("username", mssql.VarChar, username)
      .query("SELECT UserID, Username, Password FROM Users WHERE Username = @username");

    if (userCheck.recordset.length === 0) {
      return res.status(401).json({ error: "Username does not exist" });
    }

    // Then check password
    const user = userCheck.recordset[0];
    if (user.Password !== password) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Get full user details for successful login
    const result = await connection
      .request()
      .input("username", mssql.VarChar, username)
      .query(
        "SELECT UserID, Username, Fullname, Role FROM Users WHERE Username = @username"
      );

    const userData = result.recordset[0];
    console.log("User data from DB:", userData);
      
    const token = jwt.sign(
      { 
        id: userData.UserID,
        username: userData.Username,
        fullname: userData.Fullname,
        role: userData.Role.toLowerCase()
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log("Generated token payload:", { 
      id: userData.UserID,
      username: userData.Username,
      fullname: userData.Fullname,
      role: userData.Role.toLowerCase()
    });

    res.json({ 
      token,
      role: userData.Role.toLowerCase(),
      username: userData.Username,
      fullname: userData.Fullname
    });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// Get all tickets endpoint with user filtering
app.get("/api/tickets", authenticateToken, async (req, res) => {
  try {
    const connection = await pool.connect();
    let query = `
      SELECT t.*, 
             CASE t.Priority
               WHEN 'High' THEN 1
               WHEN 'Medium' THEN 2
               WHEN 'Low' THEN 3
               ELSE 4
             END as PriorityOrder
      FROM Tickets t
    `;
    
    // If not admin, only show user's tickets
    if (req.user.role !== 'admin') {
      query += " WHERE t.CreatedBy = @username";
    }

    // Add sorting by priority (High first) and date (newest first)
    query += " ORDER BY PriorityOrder ASC, Date DESC";

    const result = await connection
      .request()
      .input("username", mssql.VarChar, req.user.username)
      .query(query);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(200).json([]); // Return empty array if no tickets found
    }
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// Get support user's assigned tickets
app.get("/api/support-tickets", authenticateToken, async (req, res) => {
  // Verify user is support
  if (req.user.role !== 'support') {
    return res.status(403).json({ error: "Access denied. Support users only." });
  }

  try {
    const connection = await pool.connect();
    console.log("Support user authenticated:", req.user);

    // Get the actual tickets with priority and date sorting
    const result = await connection
      .request()
      .input("username", mssql.VarChar, req.user.username)
      .query(`
        SELECT t.*,
               CASE t.Priority
                 WHEN 'High' THEN 1
                 WHEN 'Medium' THEN 2
                 WHEN 'Low' THEN 3
                 ELSE 4
               END as PriorityOrder
        FROM Tickets t
        WHERE t.AssignedTo = @username
        ORDER BY PriorityOrder ASC, Date DESC
      `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// New endpoint to get a single ticket by ticketCode
app.get("/api/tickets/:ticketCode", authenticateToken, async (req, res) => {
  const { ticketCode } = req.params;

  try {
    const connection = await pool.connect();
    
    // Get ticket details
    const ticketResult = await connection
      .request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .query("SELECT * FROM Tickets WHERE TicketCode = @ticketCode");

    if (ticketResult.recordset.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Get comments for this ticket
    const commentsResult = await connection
      .request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .query("SELECT * FROM Comments WHERE TicketCode = @ticketCode ORDER BY CommentDate DESC");

    // Combine ticket and comments
    const ticket = ticketResult.recordset[0];
    ticket.comments = commentsResult.recordset || [];

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// New endpoint to get all comments for a ticket
app.get("/api/tickets/:ticketCode/comments", authenticateToken, async (req, res) => {
  const { ticketCode } = req.params;

  try {
    const connection = await pool.connect();
    const result = await connection
      .request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .query("SELECT * FROM Comments WHERE TicketCode = @ticketCode");

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json({ error: "Comments not found" });
    }
  } catch (error) {
    console.error("Error fetching Comments:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// Create ticket endpoint
app.post("/api/tickets", authenticateToken, async (req, res) => {
  const { title, description, priority } = req.body;
  const ticketCode = uuidv4();

  console.log('Creating ticket:', { title, description, priority });
  console.log('User:', req.user);

  try {
    const connection = await pool.connect();

    // Get user's email
    const userResult = await connection.request()
      .input("username", mssql.VarChar, req.user.username)
      .query("SELECT Email FROM Users WHERE Username = @username");

    console.log('User query result:', userResult.recordset);

    if (userResult.recordset.length === 0) {
      console.log('User not found');
      return res.status(404).json({ error: "User not found" });
    }

    const userEmail = userResult.recordset[0].Email;
    console.log('User email:', userEmail);

    const result = await connection.request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .input("title", mssql.VarChar, title)
      .input("description", mssql.VarChar, description)
      .input("priority", mssql.VarChar, priority)
      .input("createdBy", mssql.VarChar, req.user.username)
      .query(`
        INSERT INTO Tickets (TicketCode, Title, Description, Priority, Status, CreatedBy, Date, Employee)
        VALUES (@ticketCode, @title, @description, @priority, 'Open', @createdBy, GETDATE(), @createdBy);
      `);

    // Send email notifications
    try {
      console.log('Sending email notifications');
      await sendTicketCreationNotification(
        { 
          ticketCode, 
          title, 
          description, 
          priority 
        },
        { 
          username: req.user.username,
          email: userEmail
        }
      );
      console.log('Email notifications sent');
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
      // Continue with the response even if email fails
    }

    res.status(201).json({ message: "Ticket created successfully", ticketCode });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ error: "Error creating ticket" });
  }
});

// New endpoint to create a comment for a ticket
app.post("/api/tickets/:ticketCode/comments", authenticateToken, async (req, res) => {
  const { ticketCode } = req.params;
  const { commentText } = req.body;

  if (!commentText) {
    return res.status(400).json({ error: "Comment text is required" });
  }

  try {
    const connection = await pool.connect();

    // Get ticket details and related users
    const ticketDetails = await connection.request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .query(`
        SELECT 
          t.Title,
          t.CreatedBy,
          t.AssignedTo,
          c.Email as CreatorEmail,
          CASE 
            WHEN a.Email IS NOT NULL THEN a.Email 
            ELSE NULL 
          END as AssigneeEmail
        FROM Tickets t
        LEFT JOIN Users c ON t.CreatedBy = c.Username
        LEFT JOIN Users a ON t.AssignedTo = a.Username
        WHERE t.TicketCode = @ticketCode
      `);

    if (ticketDetails.recordset.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const ticket = ticketDetails.recordset[0];

    // Insert the comment
    const commentResult = await connection.request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .input("commentText", mssql.Text, commentText)
      .input("commentedBy", mssql.VarChar, req.user.username)
      .query(`
        INSERT INTO Comments (TicketCode, CommentText, CommentedBy)
        OUTPUT 
          INSERTED.CommentID,
          INSERTED.CommentText,
          INSERTED.CommentedBy,
          INSERTED.TicketCode
        VALUES (@ticketCode, @commentText, @commentedBy)
      `);

    const newComment = commentResult.recordset[0];

    // Prepare list of unique email recipients
    const recipientEmails = new Set([
      process.env.ADMIN_EMAIL,  // Admin always gets notified
      ticket.CreatorEmail      // Ticket creator always gets notified
    ]);

    // Add assignee email if ticket is assigned
    if (ticket.AssigneeEmail) {
      recipientEmails.add(ticket.AssigneeEmail);
    }

    // Remove the commenter's own email to avoid self-notification
    const commenterEmail = req.user.email;
    recipientEmails.delete(commenterEmail);

    // Send email notifications
    await sendCommentNotification(
      { 
        ticketCode, 
        title: ticket.Title,
        commentText 
      },
      { 
        username: req.user.username,
        email: req.user.email
      },
      Array.from(recipientEmails)
    );

    res.status(201).json({ 
      message: "Comment added successfully",
      comment: {
        id: newComment.CommentID,
        text: newComment.CommentText,
        commentedBy: newComment.CommentedBy,
        date: new Date().toISOString(),
        ticketCode: newComment.TicketCode
      }
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Error adding comment" });
  }
});

// Delete ticket endpoint (admin only)
app.delete("/api/tickets/:ticketCode", authenticateToken, async (req, res) => {
  const { ticketCode } = req.params;

  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Only administrators can delete tickets" });
  }

  try {
    const connection = await pool.connect();
    
    // First delete all comments associated with the ticket
    await connection
      .request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .query("DELETE FROM Comments WHERE TicketCode = @ticketCode");

    // Then delete the ticket
    const result = await connection
      .request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .query("DELETE FROM Tickets WHERE TicketCode = @ticketCode");

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Ticket deleted successfully" });
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// Update ticket endpoint (admin only)
app.put("/api/tickets/:ticketCode", authenticateToken, async (req, res) => {
  const { ticketCode } = req.params;
  const { title, description, status, priority } = req.body;

  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Only administrators can update tickets" });
  }

  try {
    const connection = await pool.connect();
    const result = await connection
      .request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .input("title", mssql.VarChar, title)
      .input("description", mssql.VarChar, description)
      .input("status", mssql.VarChar, status)
      .input("priority", mssql.VarChar, priority)
      .query(`
        UPDATE Tickets 
        SET Title = @title, 
            Description = @description, 
            Status = @status, 
            Priority = @priority,
            UpdatedDate = GETDATE()
        WHERE TicketCode = @ticketCode
      `);

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Ticket updated successfully" });
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// Get support users endpoint
app.get("/api/support-users", authenticateToken, async (req, res) => {
  try {
    const connection = await pool.connect();
    const result = await connection.request()
      .query(`SELECT UserId, Username FROM Users WHERE Role = 'Support'`);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching support users:", error);
    res.status(500).json({ error: "Failed to fetch support users" });
  }
});

// Assign ticket to support user endpoint (accepts both PUT and POST)
app.post("/api/tickets/:ticketCode/assign", authenticateToken, async (req, res) => {
  const { ticketCode } = req.params;
  const { assignedTo } = req.body;

  console.log('Assigning ticket:', { ticketCode, assignedTo });

  // Check if user is admin
  if (req.user.role !== 'admin') {
    console.log('Permission denied: User is not admin', req.user);
    return res.status(403).json({ error: "Only administrators can assign tickets" });
  }

  try {
    const connection = await pool.connect();
    
    // Get the assignee's email
    console.log('Finding support user:', assignedTo);
    const assigneeResult = await connection.request()
      .input("username", mssql.VarChar, assignedTo)
      .query("SELECT * FROM Users WHERE Username = @username");
    
    console.log('Assignee query result:', assigneeResult.recordset);
    
    if (assigneeResult.recordset.length === 0) {
      console.log('Support user not found');
      return res.status(404).json({ error: "Support user not found" });
    }

    const assigneeEmail = assigneeResult.recordset[0].Email;
    console.log('Found assignee email:', assigneeEmail);

    // Update ticket assignment
    console.log('Updating ticket assignment');
    const updateResult = await connection.request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .input("assignedTo", mssql.VarChar, assignedTo)
      .query(`
        UPDATE Tickets 
        SET AssignedTo = @assignedTo,
            Status = CASE 
              WHEN @assignedTo IS NULL THEN 'Open'
              WHEN Status = 'Open' THEN 'In Progress'
              ELSE Status 
            END,
            UpdatedDate = GETDATE()
        WHERE TicketCode = @ticketCode;

        SELECT @@ROWCOUNT as affected;
      `);

    console.log('Update result:', updateResult);
    
    if (updateResult.recordset[0].affected === 0) {
      console.log('Ticket not found');
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Get ticket details
    console.log('Getting ticket details');
    const ticketResult = await connection.request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .query("SELECT Title FROM Tickets WHERE TicketCode = @ticketCode");
    
    console.log('Ticket query result:', ticketResult.recordset);
    
    if (ticketResult.recordset.length === 0) {
      console.log('Ticket details not found');
      return res.status(404).json({ error: "Ticket not found" });
    }

    const ticket = ticketResult.recordset[0];

    // Send email notifications
    try {
      console.log('Sending email notification');
      await sendTicketAssignmentNotification(
        { ticketCode, title: ticket.Title },
        { username: assignedTo, email: assigneeEmail },
        process.env.ADMIN_EMAIL
      );
      console.log('Email notification sent');
    } catch (emailError) {
      console.error("Error sending assignment notification:", emailError);
      // Continue with the response even if email fails
    }

    console.log('Assignment successful');
    res.json({ message: "Ticket assigned successfully" });
  } catch (error) {
    console.error("Error assigning ticket:", error);
    res.status(500).json({ error: "Error assigning ticket" });
  }
});

app.put("/api/tickets/:ticketCode/assign", authenticateToken, async (req, res) => {
  const { ticketCode } = req.params;
  const { assignedTo } = req.body;

  console.log('Assigning ticket:', { ticketCode, assignedTo });

  // Check if user is admin
  if (req.user.role !== 'admin') {
    console.log('Permission denied: User is not admin', req.user);
    return res.status(403).json({ error: "Only administrators can assign tickets" });
  }

  try {
    const connection = await pool.connect();
    
    // Get the assignee's email
    console.log('Finding support user:', assignedTo);
    const assigneeResult = await connection.request()
      .input("username", mssql.VarChar, assignedTo)
      .query("SELECT * FROM Users WHERE Username = @username");
    
    console.log('Assignee query result:', assigneeResult.recordset);
    
    if (assigneeResult.recordset.length === 0) {
      console.log('Support user not found');
      return res.status(404).json({ error: "Support user not found" });
    }

    const assigneeEmail = assigneeResult.recordset[0].Email;
    console.log('Found assignee email:', assigneeEmail);

    // Update ticket assignment
    console.log('Updating ticket assignment');
    const updateResult = await connection.request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .input("assignedTo", mssql.VarChar, assignedTo)
      .query(`
        UPDATE Tickets 
        SET AssignedTo = @assignedTo,
            Status = CASE 
              WHEN @assignedTo IS NULL THEN 'Open'
              WHEN Status = 'Open' THEN 'In Progress'
              ELSE Status 
            END,
            UpdatedDate = GETDATE()
        WHERE TicketCode = @ticketCode;

        SELECT @@ROWCOUNT as affected;
      `);

    console.log('Update result:', updateResult);
    
    if (updateResult.recordset[0].affected === 0) {
      console.log('Ticket not found');
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Get ticket details
    console.log('Getting ticket details');
    const ticketResult = await connection.request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .query("SELECT Title FROM Tickets WHERE TicketCode = @ticketCode");
    
    console.log('Ticket query result:', ticketResult.recordset);
    
    if (ticketResult.recordset.length === 0) {
      console.log('Ticket details not found');
      return res.status(404).json({ error: "Ticket not found" });
    }

    const ticket = ticketResult.recordset[0];

    // Send email notifications
    try {
      console.log('Sending email notification');
      await sendTicketAssignmentNotification(
        { ticketCode, title: ticket.Title },
        { username: assignedTo, email: assigneeEmail },
        process.env.ADMIN_EMAIL
      );
      console.log('Email notification sent');
    } catch (emailError) {
      console.error("Error sending assignment notification:", emailError);
      // Continue with the response even if email fails
    }

    console.log('Assignment successful');
    res.json({ message: "Ticket assigned successfully" });
  } catch (error) {
    console.error("Error assigning ticket:", error);
    res.status(500).json({ error: "Error assigning ticket" });
  }
});

// Update ticket status endpoint (for support and admin users)
app.put("/api/tickets/:ticketCode/status", authenticateToken, async (req, res) => {
  const { ticketCode } = req.params;
  const { status } = req.body;

  // Allow both admin and support users to update status
  if (req.user.role !== 'support' && req.user.role !== 'admin') {
    return res.status(403).json({ error: "Only support and admin users can update ticket status" });
  }

  try {
    const connection = await pool.connect();
    
    // For support users, verify ticket assignment. Admins can update any ticket
    let ticketQuery = `
      SELECT t.*, 
             CASE t.Priority
               WHEN 'High' THEN 1
               WHEN 'Medium' THEN 2
               WHEN 'Low' THEN 3
               ELSE 4
             END as PriorityOrder
      FROM Tickets t
    `;
    
    if (req.user.role === 'support') {
      ticketQuery += ' WHERE t.AssignedTo = @username';
    }

    // Add sorting by priority (High first) and date (newest first)
    ticketQuery += " ORDER BY PriorityOrder ASC, Date DESC";

    const checkTicket = await connection
      .request()
      .input('ticketCode', mssql.VarChar, ticketCode)
      .input('username', mssql.VarChar, req.user.username)
      .query(ticketQuery);

    if (checkTicket.recordset.length === 0) {
      return res.status(403).json({ 
        error: req.user.role === 'support' 
          ? "You can only update tickets assigned to you" 
          : "Ticket not found"
      });
    }

    const ticket = checkTicket.recordset[0];

    // Update the ticket status
    const result = await connection
      .request()
      .input('ticketCode', mssql.VarChar, ticketCode)
      .input('status', mssql.VarChar, status)
      .input('updatedDate', mssql.DateTime, new Date())
      .query(`
        UPDATE Tickets 
        SET Status = @status,
            UpdatedDate = @updatedDate
        WHERE TicketCode = @ticketCode
      `);

    if (result.rowsAffected[0] > 0) {
      // Send appropriate email notifications based on the new status
      try {
        if (status === 'Resolved') {
          await sendTicketResolutionNotification(
            { 
              ticketCode,
              title: ticket.Title,
              status: status
            },
            {
              username: req.user.username,
              email: ticket.SupportEmail || req.user.email
            },
            {
              username: ticket.CreatedBy,
              email: ticket.CreatorEmail
            }
          );
        } else if (status === 'Closed') {
          await sendTicketClosureNotification(
            {
              ticketCode,
              title: ticket.Title,
              status: status
            },
            {
              username: req.user.username,
              email: ticket.SupportEmail || req.user.email
            },
            {
              username: ticket.CreatedBy,
              email: ticket.CreatorEmail
            }
          );
        }
      } catch (emailError) {
        console.error("Error sending status update notification:", emailError);
        // Continue with the response even if email fails
      }

      res.json({ message: "Ticket status updated successfully" });
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({ error: "Failed to update ticket status" });
  }
});

// Add new endpoint for support to resolve tickets
app.put("/api/tickets/:ticketCode/resolve", authenticateToken, async (req, res) => {
  const { ticketCode } = req.params;

  // Verify user is support
  if (req.user.role !== 'support') {
    return res.status(403).json({ error: "Only support users can resolve tickets" });
  }

  try {
    const connection = await pool.connect();
    
    // Verify ticket is assigned to this support user
    const checkTicket = await connection.request()
      .input('ticketCode', mssql.VarChar, ticketCode)
      .input('username', mssql.VarChar, req.user.username)
      .query('SELECT TicketCode FROM Tickets WHERE TicketCode = @ticketCode AND AssignedTo = @username');

    if (checkTicket.recordset.length === 0) {
      return res.status(403).json({ error: "You can only resolve tickets assigned to you" });
    }

    // Update ticket status to Resolved
    const result = await connection.request()
      .input('ticketCode', mssql.VarChar, ticketCode)
      .query(`
        UPDATE Tickets 
        SET Status = 'Resolved',
            UpdatedDate = GETDATE()
        WHERE TicketCode = @ticketCode
      `);

    if (result.rowsAffected[0] > 0) {
      res.json({ message: "Ticket marked as resolved" });
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (error) {
    console.error("Error resolving ticket:", error);
    res.status(500).json({ error: "Failed to resolve ticket" });
  }
});

app.put("/api/tickets/:ticketCode/close", authenticateToken, async (req, res) => {
  const { ticketCode } = req.params;

  try {
    const connection = await pool.connect();
    
    // Get ticket and support member details
    const ticketResult = await connection.request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .query(`
        SELECT t.Title, t.AssignedTo, u.Email as SupportEmail, c.Email as CreatorEmail
        FROM Tickets t
        JOIN Users u ON t.AssignedTo = u.Username
        JOIN Users c ON t.CreatedBy = c.Username
        WHERE t.TicketCode = @ticketCode
      `);
    
    const ticket = ticketResult.recordset[0];

    // Update ticket status
    await connection.request()
      .input('ticketCode', mssql.VarChar, ticketCode)
      .query(`
        UPDATE Tickets 
        SET Status = 'Closed',
            UpdatedDate = GETDATE()
        WHERE TicketCode = @ticketCode
      `);

    // Send email notifications
    await sendTicketClosureNotification(
      { ticketCode, title: ticket.Title },
      { username: ticket.AssignedTo, email: ticket.SupportEmail },
      { username: ticket.CreatedBy, email: ticket.CreatorEmail }
    );

    res.json({ message: "Ticket closed successfully" });
  } catch (error) {
    console.error("Error closing ticket:", error);
    res.status(500).json({ error: "Failed to close ticket" });
  }
});

const PORT = 8081;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('TicketSystem Server Is Running');
});