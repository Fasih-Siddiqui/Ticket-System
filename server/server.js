import express from "express";
import cors from "cors";
import mssql from "mssql";

const app = express();
app.use(cors());
app.use(express.json()); 

//Fasih Bhai Laptop

// const config = {
//   user: "sa",
//   password: "1211",
//   server: "SIDDIQUI",
//   database: "TicketSystem",
//   port: 1433,
//   options: { encrypt: false },
//   pool: {
//     max: 10,
//     min: 0,
//     idleTimeoutMillis: 15000,
//   },
// };


// // Abdul Haseeb's PC

// const config = {
//   user: "sa",
//   password: "haseeb554hamid",
//   server: "DESKTOP-GIJFQ1H",
//   database: "TicketSystem",
//   port: 1433,
//   options: { encrypt: false },
//   pool: {
//     max: 10,
//     min: 0,
//     idleTimeoutMillis: 15000,
//   },
// };


// //Mubeen Home PC

// const config = {
//   user: "sa",
//   password: "sap123",
//   server: "DESKTOP-JB8QTMC",
//   database: "TicketSystem",
//   port: 1433,
//   options: { encrypt: false },
//   pool: {
//     max: 10,
//     min: 0,
//     idleTimeoutMillis: 15000,
//   },
// };

//Mubeen Laptop

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

// Signup Logic

const pool = new mssql.ConnectionPool(config);

// Signup Logic
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

// Login Logic
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
      if (user.Username === "admin") {
        res.json({ role: "admin" });
      } else if (user.Username === "HR") {
        res.json({ role: "hr" });
      } else {
        res.json({ role: "user" });
      }
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// Fetch Tickets Logic

app.get("/api/tickets", async (req, res) => {
  try {
    const connection = await pool.connect();
    const result = await connection.request().query("SELECT * FROM Tickets");

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json({ error: "No tickets found" });
    }
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});


//Create Ticket System Logic

app.post("/api/ticket", async (req, res) => {
  const { title, employee, date, description, status, priority } = req.body;

  if (!title || !employee || !date || !description) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  const ticketCode = `T${Date.now()}`; 
  const createdBy = "Admin"; 

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
      .input("createdBy", mssql.VarChar, createdBy)
      .input("status", mssql.VarChar, status)
      .query(
        "INSERT INTO Tickets (TicketCode, Title, Description, Employee, Priority, Date, CreatedBy, Status) VALUES (@ticketCode, @title, @description, @employee, @priority, @date, @createdBy, @status)"
      );

    if (result.rowsAffected.length > 0) {
      res.status(201).json({ message: "Ticket created successfully" });
    } else {
      console.error("Insert failed. Result:", result); 
      res.status(500).json({ error: "Ticket creation failed" });
    }
  } catch (error) {
    console.error("Error creating ticket:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
