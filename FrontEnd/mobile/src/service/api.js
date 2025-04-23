import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env'; // Certifique-se de que o .env está configurado corretamente

// Configura a instância do Axios
const api = axios.create({
  baseURL: API_URL || 'http://localhost:5000/api', // Fallback para o URL padrão
});

// Intercepta as requisições para adicionar o token de autenticação
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('Configuração da requisição:', config); // Log para depuração
    } catch (error) {
      console.error('Erro ao recuperar o token:', error);
    }
    return config;
  },
  (error) => {
    console.error('Erro na configuração da requisição:', error);
    return Promise.reject(error);
  }
);

// Intercepta as respostas para tratar erros globais
api.interceptors.response.use(
  (response) => {
    console.log('Resposta da API:', response.data); // Log para depuração
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Erro na resposta da API:', error.response.data);
    } else {
      console.error('Erro na conexão com a API:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;