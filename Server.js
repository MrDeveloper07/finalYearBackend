const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./config/db");
const authRoutes = require("./routes/auth");

dotenv.config(); 

const app = express();
app.use(cors()); 
app.use(express.json()); 

// Setup routes
app.use('/api/auth', authRoutes); // Prefix for all auth routes

// Connect to the database
connectDb();

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
