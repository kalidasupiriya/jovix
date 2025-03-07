const JobPost = require('../models/JobPost');
const User = require('../models/User');
// Create a new job post

const createJobPost = async (req, res) => {
    try {
        const { title, description, location, salary, date, company, jobType, experience, skills, status } = req.body;
        const userId = req.user._id;
    if(!title || !description || !location || !salary || !date || !company || !jobType || !experience || !skills || !status ){
        console.log("All fields are required");
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const existingUser = await User.findById(userId);
    if (!existingUser) {
        console.log("User does not exist");
        return res.status(400).json({ success: false, message: "User does not exist" });
    }
    if (!["recruiter", "admin"].includes(req.user.role)){
        console.log("You are not authorized to create a job post");
        return res.status(400).json({ success: false, message: "You are not authorized to create a job post" });
    }
    const jobPost = new JobPost({ title, description, location, salary, date, company, jobType, experience, skills, status, user: userId, });

    await jobPost.save();
    res.status(201).json({ success: true, message: "Job Posting Created Successfully" });

    } catch (error) {
        console.log("Error in creating job posting");
        res.status(500).json({ success: false, message: "Error in creating Job Posting" });

    }
};

// get all job posts
const getAllJobPosts = async (req, res) => {
    try {
        const jobPosts = await JobPost.find().populate('user');
        if(!jobPosts){
            console.log("No job posts found");
            return res.status(404).json({ success: false, message: "No job posts found" })
        }
        res.status(200).json({ success: true, data: jobPosts });
    } catch (error) {
        console.log("Error in getting Job postings");
        res.status(500).json({ success: false, message: "Error in getting job postings" });
    }
};

module.exports = { createJobPost, getAllJobPosts };