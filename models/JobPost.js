const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    salary: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    jobType: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        required: true
    },
    status: { 
        type: String, 
        required: true, 
        enum: ["open", "closed", "pending"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("JobPost", jobPostSchema);