const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    role: {
        type: String,
        enum: ['admin', 'recruiter', 'user'],
        default: 'user',
    }
},
    {
        timestamps: true
    }
);
userSchema.virtual("jobPosts", {
    ref: "JobPost",
    localField: "_id",
    foreignField: "user"
});
module.exports = mongoose.model('User', userSchema);