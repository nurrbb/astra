const Product = require('../models/Product');
const { getRedisClient } = require('../config/index');
const ErrorCodes = require('../utils/errorCodes');

const CACHE_KEY = 'products:all';
const CACHE_TTL = 3600;

const getAllProducts = async (req, res, next) => {
  try {
    const redisClient = getRedisClient();

    if (redisClient) {
      try {
        const cached = await redisClient.get(CACHE_KEY);
        if (cached) {
          return res.status(200).json({
            success: true,
            message: 'Ürünler cache\'den getirildi',
            data: JSON.parse(cached),
          });
        }
      } catch (cacheErr) {
        console.error('Cache okuma hatası:', cacheErr);
      }
    }

    const products = await Product.find().sort({ createdAt: -1 });

    if (redisClient) {
      try {
        await redisClient.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(products));
      } catch (cacheErr) {
        console.error('Cache yazma hatası:', cacheErr);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Ürünler başarıyla getirildi',
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        code: 'PROD_001',
        message: ErrorCodes.PROD_001,
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        code: 'PROD_003',
        message: ErrorCodes.PROD_003,
      });
    }
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;

    if (!name || !description || !price || !imageUrl || !category) {
      return res.status(400).json({
        success: false,
        code: 'PROD_002',
        message: ErrorCodes.PROD_002,
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      imageUrl,
      category,
    });

    const redisClient = getRedisClient();
    if (redisClient) {
      try {
        await redisClient.del(CACHE_KEY);
      } catch (cacheErr) {
        console.error('Cache silme hatası:', cacheErr);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Ürün oluşturuldu',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        code: 'PROD_001',
        message: ErrorCodes.PROD_001,
      });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (imageUrl) product.imageUrl = imageUrl;
    if (category) product.category = category;

    await product.save();

    const redisClient = getRedisClient();
    if (redisClient) {
      try {
        await redisClient.del(CACHE_KEY);
      } catch (cacheErr) {
        console.error('Cache silme hatası:', cacheErr);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Ürün güncellendi',
      data: product,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        code: 'PROD_003',
        message: ErrorCodes.PROD_003,
      });
    }
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        code: 'PROD_001',
        message: ErrorCodes.PROD_001,
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    const redisClient = getRedisClient();
    if (redisClient) {
      try {
        await redisClient.del(CACHE_KEY);
      } catch (cacheErr) {
        console.error('Cache silme hatası:', cacheErr);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Ürün silindi',
      data: {},
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        code: 'PROD_003',
        message: ErrorCodes.PROD_003,
      });
    }
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
