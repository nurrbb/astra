const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorCodes = require('../utils/errorCodes');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        code: 'AUTH_001',
        message: ErrorCodes.AUTH_001,
      });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false,
        code: 'AUTH_001',
        message: ErrorCodes.AUTH_001,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        code: 'AUTH_003',
        message: ErrorCodes.AUTH_003,
      });
    }

    req.user = {
      userId: user._id.toString(),
      ...decoded
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        code: 'AUTH_002',
        message: ErrorCodes.AUTH_002,
      });
    }
    res.status(401).json({ 
      success: false,
      code: 'AUTH_001',
      message: ErrorCodes.AUTH_001,
    });
  }
};

module.exports = auth;

