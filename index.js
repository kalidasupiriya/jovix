const express = require("express");
const app = express();
const dotEnv = require("dotenv");
dotEnv.config();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const UserRoutes = require("./routes/UserRoutes");
const JobPostRouter = require("./routes/JobPostRoutes");

const PORT = process.env.PORT || 3000;

// Database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Database connected"))
    .catch((err) => console.error("Database connection error:", err));

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// Routes
app.use("/api/user/", UserRoutes);
app.use("/api/jobpost/", JobPostRouter);

// Root route (optional, for testing)
app.get("/", (req, res) => {
    res.send("Server Running Successfully");
});

// Catch-all for unmatched routes
app.use((req, res) => {
    console.log(`Unmatched route: ${req.method} ${req.url}`);
    res.status(404).send("Route not found");
});

// Start server
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});