const { getElasticsearchClient } = require('../config');
const ErrorCodes = require('../utils/errorCodes');

const searchProducts = async (req, res, next) => {
  try {
    const { q, category, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    const esClient = getElasticsearchClient();

    if (!esClient) {
      return res.status(503).json({
        success: false,
        code: 'SYS_002',
        message: 'Arama servisi şu anda kullanılamıyor',
      });
    }

    const from = (parseInt(page) - 1) * parseInt(limit);
    const mustQueries = [];
    const shouldQueries = [];

    if (q) {
      shouldQueries.push(
        {
          match: {
            name: {
              query: q,
              boost: 3,
              fuzziness: 'AUTO',
            },
          },
        },
        {
          match: {
            description: {
              query: q,
              boost: 1,
              fuzziness: 'AUTO',
            },
          },
        }
      );
    }

    if (category) {
      mustQueries.push({
        term: {
          category: category,
        },
      });
    }

    if (minPrice || maxPrice) {
      const priceRange = {};
      if (minPrice) priceRange.gte = parseFloat(minPrice);
      if (maxPrice) priceRange.lte = parseFloat(maxPrice);

      mustQueries.push({
        range: {
          price: priceRange,
        },
      });
    }

    const query = {
      bool: {},
    };

    if (mustQueries.length > 0) {
      query.bool.must = mustQueries;
    }

    if (shouldQueries.length > 0) {
      query.bool.should = shouldQueries;
      query.bool.minimum_should_match = 1;
    }

    if (mustQueries.length === 0 && shouldQueries.length === 0) {
      query.match_all = {};
    }

    const result = await esClient.search({
      index: 'products',
      query: query,
      from: from,
      size: parseInt(limit),
      sort: [
        { _score: { order: 'desc' } },
        { createdAt: { order: 'desc' } },
      ],
    });

    const products = result.hits.hits.map((hit) => ({
      _id: hit._id,
      ...hit._source,
      score: hit._score,
    }));

    res.status(200).json({
      success: true,
      message: 'Arama sonuçları getirildi',
      data: products,
      pagination: {
        total: result.hits.total.value,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.hits.total.value / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Elasticsearch arama hatası:', error);
    next(error);
  }
};

const suggestProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    const esClient = getElasticsearchClient();

    if (!esClient || !q) {
      return res.status(400).json({
        success: false,
        code: 'PROD_002',
        message: ErrorCodes.PROD_002,
      });
    }

    const result = await esClient.search({
      index: 'products',
      query: {
        multi_match: {
          query: q,
          fields: ['name^3', 'description'],
          type: 'best_fields',
          fuzziness: 'AUTO',
        },
      },
      size: 5,
    });

    const suggestions = result.hits.hits.map((hit) => ({
      _id: hit._id,
      name: hit._source.name,
      category: hit._source.category,
    }));

    res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error('Elasticsearch öneri hatası:', error);
    next(error);
  }
};

module.exports = {
  searchProducts,
  suggestProducts,
};

