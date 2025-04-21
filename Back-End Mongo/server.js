require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://192.168.2.95:8081', // IP do seu Expo ou frontend
    credentials: true,
}));

// Conexão com o MongoDB
connectDB();

// Rotas
app.use('/api/auth', require('./src/routes/authRoutes')); // Rotas de autenticação
app.use('/api/products', require('./src/routes/productRoutes')); // Rotas de produtos
app.use('/api/restaurants', require('./src/routes/restaurantsRoutes')); // Rotas de restaurantes

// Rota padrão para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.send('API do Aplicativo Refeitório está rodando!');
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro no servidor:', err.message);
    res.status(500).json({ message: 'Erro interno no servidor.' });
});

// Porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));