// gold-scheme-service/controllers/purchaseController.js
const Purchase = require('../models/purchaseModel');
const Scheme = require('../models/schemeModel');
const calculationUtils = require('../utils/calculationUtils');

// Create a new purchase
exports.createPurchase = async (req, res) => {
  try {
    // Get scheme details to calculate maturity date
    const scheme = await Scheme.findById(req.body.schemeId);
    
    if (!scheme) {
      return res.status(404).json({
        status: 'fail',
        message: 'Scheme not found',
      });
    }
    
    if (!scheme.active) {
      return res.status(400).json({
        status: 'fail',
        message: 'This scheme is no longer active',
      });
    }
    
    // Calculate maturity date
    const maturityDate = new Date();
    maturityDate.setFullYear(maturityDate.getFullYear() + scheme.durationYears);
    
    // Create purchase with user ID from the authenticated user
    const newPurchase = await Purchase.create({
      userId: req.user._id,
      schemeId: req.body.schemeId,
      amount: req.body.amount,
      goldWeightInGrams: req.body.goldWeightInGrams,
      maturityDate: maturityDate,
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        purchase: newPurchase,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Get all purchases for current user
exports.getUserPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.user._id });
    
    res.status(200).json({
      status: 'success',
      results: purchases.length,
      data: {
        purchases,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Get purchase by ID (only if it belongs to current user or admin)
exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    
    if (!purchase) {
      return res.status(404).json({
        status: 'fail',
        message: 'Purchase not found',
      });
    }
    
    // Check if purchase belongs to the current user or user is admin
    if (purchase.userId !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to access this purchase',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        purchase,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Get all purchases (admin only)
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find();
    
    res.status(200).json({
      status: 'success',
      results: purchases.length,
      data: {
        purchases,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Update purchase status (admin only)
exports.updatePurchaseStatus = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (!purchase) {
      return res.status(404).json({
        status: 'fail',
        message: 'Purchase not found',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        purchase,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};



// Calculate expected returns for a purchase
exports.calculateReturns = async (req, res) => {
  try {
    const { schemeId, amount, goldPricePerGram } = req.body;
    
    // Validate required fields
    if (!schemeId || !amount || !goldPricePerGram) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide schemeId, amount, and goldPricePerGram',
      });
    }
    
    // Get scheme details
    const scheme = await Scheme.findById(schemeId);
    
    if (!scheme) {
      return res.status(404).json({
        status: 'fail',
        message: 'Scheme not found',
      });
    }
    
    // Calculate gold weight
    const goldWeightInGrams = calculationUtils.convertAmountToGoldWeight(amount, goldPricePerGram);
    
    // Calculate maturity amount
    const maturityAmount = calculationUtils.calculateMaturityAmount(amount, scheme.interestRate, scheme.durationYears);
    
    // Assuming gold price increases by 5% per year (for demonstration)
    const estimatedGoldPriceAtMaturity = goldPricePerGram * Math.pow(1.05, scheme.durationYears);
    
    // Calculate gold value at maturity
    const goldValueAtMaturity = calculationUtils.convertGoldWeightToAmount(goldWeightInGrams, estimatedGoldPriceAtMaturity);
    
    // Calculate total returns (interest + gold appreciation)
    const totalReturns = maturityAmount + (goldValueAtMaturity - amount);
    
    res.status(200).json({
      status: 'success',
      data: {
        scheme: {
          name: scheme.name,
          type: scheme.type,
          durationYears: scheme.durationYears,
          interestRate: scheme.interestRate,
        },
        investment: {
          amount,
          goldWeightInGrams,
          currentGoldPrice: goldPricePerGram,
        },
        returns: {
          maturityAmount,
          estimatedGoldPriceAtMaturity,
          goldValueAtMaturity,
          totalReturns,
          effectiveAnnualReturn: (Math.pow(totalReturns / amount, 1 / scheme.durationYears) - 1) * 100,
        },
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
