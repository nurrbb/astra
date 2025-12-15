const express = require('express');
const router = express.Router();
const { searchProducts, suggestProducts } = require('../controllers/searchController');

router.get('/', searchProducts);
router.get('/suggest', suggestProducts);

module.exports = router;

