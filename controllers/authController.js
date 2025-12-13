const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorCodes = require('../utils/errorCodes');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        code: 'AUTH_006',
        message: ErrorCodes.AUTH_006,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        code: 'AUTH_005',
        message: ErrorCodes.AUTH_005,
      });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        code: 'AUTH_006',
        message: ErrorCodes.AUTH_006,
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        code: 'AUTH_004',
        message: ErrorCodes.AUTH_004,
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        code: 'AUTH_004',
        message: ErrorCodes.AUTH_004,
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Giriş başarılı',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        code: 'AUTH_003',
        message: ErrorCodes.AUTH_003,
      });
    }

    if (name) user.name = name;
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          code: 'AUTH_005',
          message: ErrorCodes.AUTH_005,
        });
      }
      user.email = email;
    }
    if (password) user.password = password;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profil güncellendi',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  updateProfile,
};
