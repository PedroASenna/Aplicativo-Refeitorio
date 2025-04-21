const express = require('express');
const router = express.Router();

// Dados fictícios de restaurantes
const restaurants = [
  {
    id: 1,
    name: 'Restaurante A',
    image: 'https://via.placeholder.com/100',
    rating: 4.5,
    reviews: 20,
  },
  {
    id: 2,
    name: 'Restaurante B',
    image: 'https://via.placeholder.com/100',
    rating: 4.0,
    reviews: 15,
  },
];

// Endpoint para listar restaurantes
router.get('/', (req, res) => {
  console.log('Requisição recebida na rota /api/restaurants');
  res.json(restaurants);
});

module.exports = router;