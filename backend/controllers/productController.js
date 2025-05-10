const Order = require('../models/Order');
const Product = require('../models/Product');

// Criação de Produto
const createProduct = async (req, res) => {
  try {
    const { title, description, price, image, category, stock } = req.body;

    if (!title || !price || !stock) {
      return res.status(400).json({ message: 'Preencha os campos obrigatórios.' });
    }

    const priceNumber = parseFloat(price);
    const stockNumber = parseInt(stock, 10);

    if (isNaN(priceNumber) || isNaN(stockNumber)) {
      return res.status(400).json({ message: 'Preço e estoque devem ser números válidos.' });
    }

    const product = new Product({
      title,
      description,
      price: priceNumber,
      image,
      category,
      stock: stockNumber,
      seller: req.user.userId, // o ID do usuário autenticado
    });

    console.log('Dados do produto antes de salvar:', product); // Para depuração

    await product.save();

    res.status(201).json(product);
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ message: 'Erro ao criar produto', error: err.message });
  }
};

// Criação de Pedido
const createOrder = async (req, res) => {
  const { items, total } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Nenhum item no pedido.' });
  }

  try {
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) return res.status(404).json({ message: 'Produto não encontrado.' });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Estoque insuficiente para ${product.title}` });
      }

      product.stock -= item.quantity;
      await product.save();
    }

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

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    const review = {
      user: req.user.userId,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    // Recalcular a média de avaliações
    const totalRating = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.averageRating = totalRating / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Avaliação adicionada com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao adicionar avaliação', error: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchProducts = async (req, res) => {
  const { query } = req.query;

  try {
    const products = await Product.find({
      title: { $regex: query, $options: 'i' },
    }).populate('seller', 'name');

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name')
      .populate('reviews.user', 'name');
    if (!product)
      return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.userId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar seus produtos' });
  }
};

module.exports = {
  createProduct,
  createOrder,
  getAllProducts,
  searchProducts,
  getProductById,
  getMyProducts,
  addReview,
};