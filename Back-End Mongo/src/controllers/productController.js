const Product = require('../models/Product');

// Criar produto
exports.createProduct = async (req, res) => {
  try {
    const { name, price, rating } = req.body;
    const newProduct = new Product({
      name,
      price,
      rating,
      image: req.file.path,
      user: req.user.id
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

// Listar produtos
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('user', 'name email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

// Atualizar produto
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

// Deletar produto
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Produto deletado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
};