const Scheme = require('../models/schemeModel');

// Create a new scheme (admin only)
exports.createScheme = async (req, res) => {
  try {
    const newScheme = await Scheme.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        scheme: newScheme,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Get all schemes
exports.getAllSchemes = async (req, res) => {
  try {
    // Build query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    
    // Filter by active status if not specified
    if (!queryObj.active) {
      queryObj.active = { $eq: true };
    }
    
    // Find schemes that match the query
    const schemes = await Scheme.find(queryObj);
    
    res.status(200).json({
      status: 'success',
      results: schemes.length,
      data: {
        schemes,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Get scheme by ID
exports.getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({
        status: 'fail',
        message: 'Scheme not found',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        scheme,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Update scheme (admin only)
exports.updateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!scheme) {
      return res.status(404).json({
        status: 'fail',
        message: 'Scheme not found',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        scheme,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Delete scheme (admin only)
exports.deleteScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({
        status: 'fail',
        message: 'Scheme not found',
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};