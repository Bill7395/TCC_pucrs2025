const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const {
  createProduct,
  getAllProducts,
  searchProducts,
  getProductById,
  getMyProducts,
  addReview
} = require('../controllers/productController');

// Criar novo produto
router.post('/', auth, createProduct);

// Adicionar avaliação
router.post('/:productId/reviews', auth, addReview);

// Listar todos os produtos
router.get('/', getAllProducts);

// Buscar produtos
router.get('/search', searchProducts);

// Obter produtos do vendedor logado
router.get('/mine', auth, getMyProducts);

// Obter detalhes de um produto por ID
router.get('/:id', getProductById);

module.exports = router;