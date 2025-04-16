// gold-scheme-service/routes/purchaseRoutes.js
const express = require('express');
const purchaseController = require('../controllers/purchaseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All purchase routes are protected
router.use(authMiddleware.verifyToken);

// User routes
router.post('/', purchaseController.createPurchase);
router.get('/my-purchases', purchaseController.getUserPurchases);
router.get('/:id', purchaseController.getPurchaseById);

// Admin routes
router.use(authMiddleware.restrictTo('admin'));
router.get('/', purchaseController.getAllPurchases);
router.patch('/:id/status', purchaseController.updatePurchaseStatus);
router.post('/calculate-returns', purchaseController.calculateReturns);

module.exports = router;
