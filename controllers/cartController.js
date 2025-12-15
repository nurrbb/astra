const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { processPayment } = require('../services/paymentService');
const ErrorCodes = require('../utils/errorCodes');

const getCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    let cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      cart = await Cart.create({ userId, items: [], totalAmount: 0 });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

const addItemToCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        code: 'CART_004',
        message: ErrorCodes.CART_004,
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        code: 'PROD_001',
        message: ErrorCodes.PROD_001,
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [], totalAmount: 0 });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price,
      });
    }

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Ürün sepete eklendi',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

const removeItemFromCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        code: 'CART_001',
        message: ErrorCodes.CART_001,
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Ürün sepetten çıkarıldı',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        code: 'CART_001',
        message: ErrorCodes.CART_001,
      });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Sepet temizlendi',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

const checkoutCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { paymentMethod } = req.body;

    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        code: 'CART_002',
        message: ErrorCodes.CART_002,
      });
    }

    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const paymentData = {
      orderId,
      amount: cart.totalAmount,
      userId: userId,
      paymentMethod: paymentMethod || 'credit_card',
    };

    const paymentResult = await processPayment(paymentData);

    if (!paymentResult.success) {
      return res.status(paymentResult.statusCode || 500).json({
        success: false,
        code: 'PAY_001',
        message: paymentResult.error || ErrorCodes.PAY_001,
      });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Ödeme tamamlandı',
      data: {
        orderId,
        payment: paymentResult.data,
        cart: cart,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addItemToCart,
  removeItemFromCart,
  clearCart,
  checkoutCart,
};
