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
  server: "DESKTOP-KBHMTST",
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
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token." });
  }
};

// Existing signup endpoint
app.post("/api/signup", async (req, res) => {
  const { fullname, email, username, password } = req.body;

  try {
    const connection = await pool.connect();
    const result = await connection
      .request()
      .input("fullname", mssql.VarChar, fullname)
      .input("email", mssql.VarChar, email)
      .input("username", mssql.VarChar, username)
      .input("password", mssql.VarChar, password)
      .query(
        "INSERT INTO Users (Fullname, Email, Username, Password) VALUES (@fullname, @email, @username, @password)"
      );

    if (result.rowsAffected.length > 0) {
      res.status(201).json({ message: "User created successfully" });
    } else {
      res.status(500).json({ error: "User creation failed" });
    }
  } catch (error) {
    console.error("User creation error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
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
        "SELECT * FROM Users WHERE Username = @username AND Password = @password"
      );

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      const token = jwt.sign(
        { 
          id: user.UserID,
          username: user.Username,
          role: user.Role.toLowerCase()
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ 
        token,
        role: user.Role.toLowerCase(),
        username: user.Username
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
  const { title, employee, date, description, status, priority } = req.body;
  const ticketCode = uuidv4().slice(0, 8).toUpperCase(); // Generate unique ticket code for each ticket

  if (!title || !employee || !date || !description) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  try {
    const connection = await pool.connect();
    const result = await connection
      .request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .input("title", mssql.VarChar, title)
      .input("employee", mssql.VarChar, employee)
      .input("description", mssql.Text, description)
      .input("priority", mssql.VarChar, priority)
      .input("date", mssql.Date, new Date(date))
      .input("createdBy", mssql.VarChar, req.user.username)
      .input("status", mssql.VarChar, status)
      .query(
        "INSERT INTO Tickets (TicketCode, Title, Description, Employee, Priority, Date, CreatedBy, Status) VALUES (@ticketCode, @title, @description, @employee, @priority, @date, @createdBy, @status)"
      );

    if (result.rowsAffected.length > 0) {
      // Return the created ticket data including the ticketCode
      res.status(201).json({ 
        message: "Ticket created successfully",
        ticket: {
          ticketCode,
          title,
          employee,
          description,
          priority,
          date,
          createdBy: req.user.username,
          status
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
  const { commentText, commentedBy } = req.body;

  // Validate that the commenter is either the ticket owner or an admin
  try {
    const connection = await pool.connect();
    
    // First check if the user is authorized to comment on this ticket
    const ticketResult = await connection
      .request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .query("SELECT CreatedBy FROM Tickets WHERE TicketCode = @ticketCode");

    if (ticketResult.recordset.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const ticket = ticketResult.recordset[0];
    
    // Only allow comments if user is admin or the ticket creator
    if (req.user.role !== 'admin' && req.user.username !== ticket.CreatedBy) {
      return res.status(403).json({ error: "Not authorized to comment on this ticket" });
    }

    const commentDate = new Date();
    
    const result = await connection
      .request()
      .input("ticketCode", mssql.VarChar, ticketCode)
      .input("commentText", mssql.Text, commentText)
      .input("commentedBy", mssql.VarChar, commentedBy)
      .input("commentDate", mssql.DateTime, commentDate)
      .query(
        "INSERT INTO Comments (TicketCode, CommentText, CommentedBy, CommentDate) VALUES (@ticketCode, @commentText, @commentedBy, @commentDate); SELECT SCOPE_IDENTITY() AS commentId;"
      );

    if (result.recordset && result.recordset[0]) {
      res.status(201).json({ 
        message: "Comment added successfully",
        commentId: result.recordset[0].commentId
      });
    } else {
      res.status(500).json({ error: "Failed to add comment" });
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
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

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});