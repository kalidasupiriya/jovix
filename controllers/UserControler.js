const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
dotEnv.config();
//Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, gender } = req.body;

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
        const user = new User({ name, email, gender, password: hashPassword });
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
        console.log("User logged in successfully", existingUser.name);
        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: 'Strict' }).json({
            success: true,
            message: "User logged in successfully",
            token: token,
            user: {
                email: existingUser.email,
                name: existingUser.name,
                role: existingUser.role,
                id: existingUser._id
            }
        });
        //  res.status(200).json({ success: true, message: "User logged in successfully", token, user: existingUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error in login User" });
    }
};

const checkAuth = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            success: true,
            message: "User authenticated",
            user: {
                email: user.email,
                name: user.name,
                id: user._id,
                role: user.role,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error verifying authentication" });
    }
};


const logoutUser = (req, res) => {
    console.log('Logout requested');
    res.clearCookie('token', {
        httpOnly: true,
        secure: false, // Set to false for local development; true in production with HTTPS
        sameSite: 'Strict',
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};


//get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            console.log("No users found");
            return res.status(400).json({ success: false, message: "No users found" });
        }
        res.status(200).json({ success: true, message: "Users found", users });
        console.log("Users found", users);

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error in getting users" });
    }
}

// Update user by ID
const updateUserById = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    // Check if there is any data to update
    if (!Object.keys(updateData).length) {
        return res.status(400).json({ message: "No update data provided" });
    }
    try {
        // Find and update the user by ID
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        // Check if the user was found
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Return the updated user
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
        console.log("User updated successfully", updatedUser);
    } catch (error) {
        console.log(error);
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation error", error: error.message });
        }
        res.status(500).json({ success: false, message: "Error in updating user" });
    }
};

// Delete user by ID
const deleteUserById = async (req, res) => {
    const { id } = req.params;
    try {

        const user = await User.findByIdAndDelete(id);
        // Check if the user was found
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
        console.log("User deleted successfully", user);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error in deleting User" });
        
    }
}
module.exports = { registerUser, loginUser, checkAuth, logoutUser, getUsers, updateUserById, deleteUserById };