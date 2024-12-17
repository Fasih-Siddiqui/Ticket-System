import express from "express";
import cors from "cors";
import mssql from "mssql";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const JWT_SECRET = "your-secret-key"; // In production, use environment variable
const app = express();
app.use(cors({ 
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

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
    const result = await connection
      .request()
      .input("username", mssql.VarChar, username)
      .input("password", mssql.VarChar, password)
      .query(
        "SELECT UserID, Username, Fullname, Role FROM Users WHERE Username = @username AND Password = @password"
      );

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      console.log("User data from DB:", user); // Debug log
      
      const token = jwt.sign(
        { 
          id: user.UserID,
          username: user.Username,
          fullname: user.Fullname, // Make sure this matches the case from the database
          role: user.Role.toLowerCase()
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log("Generated token payload:", { 
        id: user.UserID,
        username: user.Username,
        fullname: user.Fullname,
        role: user.Role.toLowerCase()
      }); // Debug log

      res.json({ 
        token,
        role: user.Role.toLowerCase(),
        username: user.Username,
        fullname: user.Fullname
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// Get all tickets endpoint with user filtering
app.get("/api/tickets", authenticateToken, async (req, res) => {
  try {
    const connection = await pool.connect();
    let query = "SELECT * FROM Tickets";
    
    // If not admin, only show user's tickets
    if (req.user.role !== 'admin') {
      query += " WHERE CreatedBy = @username";
    }

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

    // First check if there are any tickets assigned to this user
    const checkQuery = await connection
      .request()
      .input("username", mssql.VarChar, req.user.username)
      .query("SELECT COUNT(*) as count FROM Tickets WHERE AssignedTo = @username");
    
    console.log("Number of assigned tickets:", checkQuery.recordset[0].count);

    // Get the actual tickets
    const result = await connection
      .request()
      .input("username", mssql.VarChar, req.user.username)
      .query(`
        SELECT 
          TicketCode,
          Title,
          Description,
          Status,
          Priority,
          CreatedBy,
          Date,
          AssignedTo,
          Employee
        FROM Tickets 
        WHERE AssignedTo = @username 
        ORDER BY Date DESC
      `);

    console.log("Query results:", {
      username: req.user.username,
      ticketsFound: result.recordset.length,
      firstTicket: result.recordset[0]
    });

    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    res.status(500).json({ error: "Failed to fetch tickets", details: error.message });
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
app.post("/api/ticket", authenticateToken, async (req, res) => {
  const { title, description, priority, status } = req.body;
  const ticketCode = uuidv4().slice(0, 8).toUpperCase();

  if (!title || !description || !priority) {
    return res.status(400).json({ error: "Please fill in all required fields" });
  }

  try {
    const connection = await pool.connect();
    const result = await connection
      .request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .input("title", mssql.VarChar, title)
      .input("description", mssql.Text, description)
      .input("employee", mssql.VarChar, req.user.fullname)
      .input("priority", mssql.VarChar, priority)
      .input("date", mssql.Date, new Date())
      .input("createdBy", mssql.VarChar, req.user.fullname)
      .input("status", mssql.VarChar, status || 'Open')
      .query(
        `INSERT INTO Tickets (TicketCode, Title, Description, Employee, Priority, Date, CreatedBy, Status) 
         VALUES (@ticketCode, @title, @description, @employee, @priority, @date, @createdBy, @status)`
      );

    if (result.rowsAffected.length > 0) {
      res.status(201).json({ 
        message: "Ticket created successfully",
        ticket: {
          ticketCode,
          title,
          description,
          employee: req.user.fullname,
          priority,
          date: new Date(),
          createdBy: req.user.fullname,
          status: status || 'Open'
        }
      });
    } else {
      res.status(500).json({ error: "Ticket creation failed" });
    }
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
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
    
    // Get user's fullname from database
    const userResult = await connection
      .request()
      .input("userId", mssql.Int, req.user.id)
      .query("SELECT Fullname FROM Users WHERE UserID = @userId");

    if (userResult.recordset.length === 0) {
      return res.status(400).json({ error: "Unable to process comment at this time" });
    }

    const userFullname = userResult.recordset[0].Fullname;
    
    // First check if the ticket exists and get creator
    const ticketResult = await connection
      .request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .query("SELECT CreatedBy, Employee, AssignedTo FROM Tickets WHERE TicketCode = @ticketCode");

    if (ticketResult.recordset.length === 0) {
      return res.status(400).json({ error: "Ticket not found" });
    }

    const ticket = ticketResult.recordset[0];
    
    // Allow support users assigned to the ticket to comment
    if (req.user.role === 'support' && ticket.AssignedTo !== req.user.username) {
      return res.status(403).json({ error: "You can only comment on tickets assigned to you" });
    }

    // Insert the comment
    const commentDate = new Date();
    const result = await connection
      .request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .input("commentText", mssql.Text, commentText.trim())
      .input("commentedBy", mssql.VarChar, userFullname)
      .input("commentDate", mssql.DateTime, commentDate)
      .query(
        "INSERT INTO Comments (TicketCode, CommentText, CommentedBy, CommentDate) VALUES (@ticketCode, @commentText, @commentedBy, @commentDate); SELECT SCOPE_IDENTITY() AS commentId;"
      );

    if (result.recordset && result.recordset[0]) {
      res.status(201).json({ 
        message: "Comment added successfully",
        comment: {
          id: result.recordset[0].commentId,
          text: commentText.trim(),
          commentedBy: userFullname,
          date: commentDate
        }
      });
    } else {
      res.status(400).json({ error: "Failed to add comment" });
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(400).json({ error: "Error processing comment" });
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
});// Assign ticket to support user endpoint
app.post("/api/tickets/:ticketCode/assign", authenticateToken, async (req, res) => {
  const { ticketCode } = req.params;
  const { assignedTo } = req.body;

  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Only administrators can assign tickets" });
  }

  try {
    const connection = await pool.connect();
    const result = await connection.request()
      .input('ticketCode', mssql.VarChar, ticketCode)
      .input('assignedTo', mssql.VarChar, assignedTo)
      .query(`
        UPDATE Tickets 
        SET AssignedTo = @assignedTo,
            Status = CASE 
              WHEN @assignedTo IS NULL THEN 'Open'
              WHEN Status = 'Open' THEN 'In Progress'
              ELSE Status 
            END,
            UpdatedDate = GETDATE()
        WHERE TicketCode = @ticketCode
      `);

    if (result.rowsAffected[0] > 0) {
      res.json({ message: assignedTo ? "Ticket assigned successfully" : "Ticket unassigned successfully" });
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (error) {
    console.error("Error assigning ticket:", error);
    res.status(500).json({ error: "Failed to assign ticket" });
  }
});

// Assign ticket to support user endpoint
app.post("/api/tickets/:ticketCode/assign", authenticateToken, async (req, res) => {
  const { ticketCode } = req.params;
  const { assignedTo } = req.body;  // This will be the username or null

  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Only administrators can assign tickets" });
  }

  try {
    const connection = await pool.connect();
    
    // If assignedTo is provided, verify it's a valid support user
    if (assignedTo) {
      const userCheck = await connection.request()
        .input('username', mssql.VarChar, assignedTo)
        .query('SELECT Username FROM Users WHERE Username = @username AND Role = \'support\'');
      
      if (userCheck.recordset.length === 0) {
        return res.status(400).json({ error: "Invalid support user" });
      }
    }

    // Update the ticket
    const result = await connection.request()
      .input('ticketCode', mssql.VarChar, ticketCode)
      .input('assignedTo', mssql.VarChar, assignedTo)
      .query(`
        UPDATE Tickets 
        SET AssignedTo = @assignedTo,
            Status = CASE 
              WHEN @assignedTo IS NULL THEN 'Open'
              WHEN Status = 'Open' THEN 'In Progress'
              ELSE Status 
            END,
            UpdatedDate = GETDATE()
        WHERE TicketCode = @ticketCode
      `);

    if (result.rowsAffected[0] > 0) {
      res.json({ message: assignedTo ? "Ticket assigned successfully" : "Ticket unassigned successfully" });
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (error) {
    console.error("Error assigning ticket:", error);
    res.status(500).json({ error: "Failed to assign ticket" });
  }
});

const PORT = 8081;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});