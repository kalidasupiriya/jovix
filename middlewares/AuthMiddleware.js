const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotEnv = require("dotenv");
dotEnv.config();
const authMiddleWare = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            console.log("Unauthorized: No token provided");
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }
       // console.log("Received Token:", req.cookies.token);
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verifyToken.userId);
        if (!user) {
            console.log("Unauthorized: User not found");
            return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Unauthorized: Invalid token");
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};
module.exports = authMiddleWare;