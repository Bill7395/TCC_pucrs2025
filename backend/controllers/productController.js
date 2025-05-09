const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  const { title, description, price, image, category } = req.body;

  try {
    console.log('Dados recebidos para criação:', req.body); // log para depuração

    const product = new Product({
      title,
      description,
      price,
      image,
      category,
      seller: req.user.userId, // exige autenticação
      stock
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchProducts = async (req, res) => {
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

exports.getProductById = async (req, res) => {
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

exports.addReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: 'Produto não encontrado' });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user.userId
    );

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: 'Você já avaliou este produto' });
    }

    const review = {
      user: req.user.userId,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.averageRating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Avaliação adicionada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.userId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar seus produtos' });
  }
};