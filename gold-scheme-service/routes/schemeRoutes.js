// gold-scheme-service/routes/schemeRoutes.js
const express = require('express');
const schemeController = require('../controllers/schemeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', schemeController.getAllSchemes);
router.get('/:id', schemeController.getSchemeById);

// Protected routes - admin only
router.use(authMiddleware.verifyToken);
router.use(authMiddleware.restrictTo('admin'));

router.post('/', schemeController.createScheme);
router.patch('/:id', schemeController.updateScheme);
router.delete('/:id', schemeController.deleteScheme);

module.exports = router;

