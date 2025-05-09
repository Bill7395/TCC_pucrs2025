const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  createOrder,
  getMyOrders,
  getOrdersAsSeller,
  updateOrderStatus,
  getUserOrders,
  getSellerOrders,
  getOrdersReceived,
} = require('../controllers/orderController');

router.post('/', authMiddleware, createOrder); // Criar pedido
router.get('/me', authMiddleware, getMyOrders); // Ver como comprador
router.get('/vendas', authMiddleware, getOrdersAsSeller); // Ver como vendedor
router.get('/my-orders', authMiddleware, getUserOrders); // Alias
router.get('/my-sales', authMiddleware, getSellerOrders); // Alias
router.get('/received', authMiddleware, getOrdersReceived);
router.put('/:id/status', authMiddleware, updateOrderStatus); // Atualizar status

module.exports = router;
