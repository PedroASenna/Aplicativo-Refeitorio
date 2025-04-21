const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Modelo de usuário
const jwt = require('jsonwebtoken'); // Biblioteca para gerar tokens
const bcrypt = require('bcrypt'); // Biblioteca para hash de senhas

// Registro de usuário
router.post('/register', async (req, res) => {
  const { name, email, password, mobile, isSeller } = req.body;

  try {
    // Verifica se o email já está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já registrado.' });
    }

    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria um novo usuário
    const newUser = new User({ name, email, password: hashedPassword, mobile, isSeller });
    await newUser.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Email recebido:', email);
    console.log('Senha recebida:', password);

    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    console.log('Usuário encontrado:', user);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica se a senha está correta
    console.log('Hash armazenado:', user.password);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Senha válida:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Gera um token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Retorna o token e a propriedade `isSeller`
    res.status(200).json({
      token,
      isSeller: user.isSeller || false, // Retorna se o usuário é vendedor
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

module.exports = router;