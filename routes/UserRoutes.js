const express = require("express");
const router = express.Router();
const UserController = require('../controllers/UserControler');
const AuthMiddleware = require('../middlewares/AuthMiddleware');

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/check-auth', AuthMiddleware, UserController.checkAuth);
router.post('/logout', UserController.logoutUser);
router.get('/all', UserController.getUsers);
router.patch('/update/:id', UserController.updateUserById);
router.delete('/delete/:id', UserController.deleteUserById);
module.exports = router;