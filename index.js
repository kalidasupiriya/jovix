//constants
const express = require("express");
const app = express();
const dotEnv = require("dotenv");
dotEnv.config();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const UserRoutes = require("./routes/UserRoutes");
const JobPostRouter = require("./routes/JobPostRoutes");
// port number
const PORT = process.env.PORT || 3000;

//database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("Database connected"); })
    .catch((err) => { console.log(err); });

// listen to port
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});

// routes
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173', // Allow only this frontend origin
    credentials: true, // Enable cookies and authorization headers
}));
app.use("/api/user/", UserRoutes);
app.use("/api/jobpost/", JobPostRouter);
// app.use("/", (req, res) =>{
//     res.send("Server Running Successfully");
// });