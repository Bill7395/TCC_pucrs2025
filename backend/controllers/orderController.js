const Order = require('../models/Order');
const Product = require('../models/Product');

// 📦 Criar novo pedido (compra)
const createOrder = async (req, res) => {
  const { items, total } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Nenhum item no pedido.' });
  }

  try {
    // Reduz estoque dos produtos
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: `Produto ${product?.title || ''} sem estoque suficiente.` });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    // Criar pedido
    const order = new Order({
      user: req.user.userId,
      items,
      total,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🧾 Visualizar pedidos do comprador autenticado
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product', 'title price image')
      .populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📦 Pedidos como vendedor autenticado (filtrado manualmente)
const getOrdersAsSeller = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.product': { $exists: true } })
      .populate('items.product', 'title price seller')
      .populate('user', 'name email');

    const filtered = orders.filter(order =>
      order.items.some(item => item.product && item.product.seller.toString() === req.user.userId)
    );

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🛠 Atualizar status do pedido
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ['Pendente', 'Enviado', 'Entregue'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Status inválido' });
  }

  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Pedido não encontrado' });

    // Verifica se o usuário é vendedor de ao menos um produto do pedido
    const isSeller = order.items.some(
      item => item.product && item.product.seller.toString() === req.user.userId
    );

    if (!isSeller) {
      return res.status(403).json({ message: 'Você não tem permissão para atualizar este pedido' });
    }

    order.status = status;
    await order.save();
    res.json({ message: 'Status atualizado com sucesso', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🧾 Pedidos do usuário (redundante com getMyOrders)
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product', 'title price image')
      .populate('user', 'name');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📦 Pedidos recebidos pelo vendedor (forma alternativa)
const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.product.seller': req.user.userId })
      .populate('items.product', 'title price image')
      .populate('user', 'name');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📥 Pedidos recebidos (usado em rota /received)
const getOrdersReceived = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.product.seller': req.user.userId })
      .populate('items.product', 'title price')
      .populate('user', 'name email');

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Nenhum pedido recebido.' });
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao carregar pedidos', error: err.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrdersAsSeller,
  updateOrderStatus,
  getUserOrders,
  getSellerOrders,
  getOrdersReceived,
};
