// gold-scheme-service/middleware/authMiddleware.js
const axios = require('axios');

exports.verifyToken = async (req, res, next) => {
  try {
    // Check if token exists in headers
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.',
      });
    }
    
    // Verify token with user service
    const response = await axios.post(
      `${process.env.USER_SERVICE_URL}/verify-token`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
    
    // If token is valid, set user data in request
    req.user = response.data.data.user;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      message: 'Authentication failed',
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};