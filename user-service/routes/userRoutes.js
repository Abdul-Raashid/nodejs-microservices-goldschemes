// user-service/routes/userRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-token', authController.verifyToken);

// Protected routes
router.use(authMiddleware.protect);
router.get('/me', userController.getMe);

// Admin-only routes
router.use(authMiddleware.restrictTo('admin'));
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

module.exports = router;