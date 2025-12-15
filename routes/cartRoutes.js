const express = require('express');
const router = express.Router();
const {
  getCart,
  addItemToCart,
  removeItemFromCart,
  clearCart,
  checkoutCart,
} = require('../controllers/cartController');
const auth = require('../middlewares/auth');

// All cart routes require authentication
router.use(auth);

router.get('/', getCart);
router.post('/items', addItemToCart);
router.delete('/items/:productId', removeItemFromCart);
router.delete('/', clearCart);
router.post('/checkout', checkoutCart);

module.exports = router;

