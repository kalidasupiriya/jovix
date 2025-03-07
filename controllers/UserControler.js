const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
dotEnv.config();
//Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check if all fields are filled
        if (!name || !email || !password) {
            console.log("All fields are required");
            return res.status(400).json({ success: false, message: "All fields are requir" })
        }
        // check if email is valid
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists");
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // hash password
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashPassword });
        await user.save();
        res.status(201).json({ success: true, message: "User registered successfully" });
        console.log("User registered successfully", user.name);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error in registering user" });
    }
};

//Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if all fields are filled
        if (!email || !password) {
            console.log("All fields are required");
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // check if user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            console.log("User does not exist");
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        // check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            console.log("Password is incorrect");
            return res.status(400).json({ success: false, message: "Password is incorrect" });
        }

        // create token
        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
       res.status(200).json({ success: true, message: "User logged in successfully", token, user: existingUser });
        console.log("User logged in successfully", existingUser.name);
        // res.cookie("token", token, { httpOnly: true, secure: false }).json({
        //     success: true,
        //     message: "User logged in successfully",
        //     user: {
        //         email: existingUser.email,
        //         name: existingUser.name,
        //         role: existingUser.role,
        //         id: existingUser._id
        //     }
        // })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error in login User" });
    }
}

module.exports = { registerUser, loginUser };