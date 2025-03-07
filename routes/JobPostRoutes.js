const express = require("express");
const router = express.Router();
const JobPostController = require('../controllers/JobPostController');
const authMiddleWare = require('../middlewares/AuthMiddleware');

router.post('/create', authMiddleWare, JobPostController.createJobPost);
router.get('/all', authMiddleWare, JobPostController.getAllJobPosts);
module.exports = router;