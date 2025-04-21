const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Endpoint para buscar todos os produtos
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find(); // Busca todos os produtos
    res.status(200).json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos.' });
  }
});

// Endpoint para criar um novo produto
router.post('/products', async (req, res) => {
  try {
    const { name, price, rating, image, user } = req.body;

    const newProduct = new Product({
      name,
      price,
      rating,
      image,
      user,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ message: 'Erro ao criar produto.' });
  }
});

module.exports = router;