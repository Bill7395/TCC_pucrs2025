const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const isSeller = req.user.isSeller;

    if (isSeller) {
      const sales = await Order.find({ seller: userId });
      const products = await Product.find({ seller: userId });

      const totalFaturado = sales.reduce((acc, sale) => acc + sale.product?.price || 0, 0);

      res.json({
        name: req.user.name,
        role: 'Vendedor',
        totalVendas: sales.length,
        totalFaturado,
        produtosCadastrados: products.length
      });
    } else {
      const pedidos = await Order.find({ buyer: userId }).populate('product');
      const totalGasto = pedidos.reduce((acc, p) => acc + (p.product?.price || 0), 0);

      res.json({
        name: req.user.name,
        role: 'Comprador',
        totalPedidos: pedidos.length,
        totalGasto
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
