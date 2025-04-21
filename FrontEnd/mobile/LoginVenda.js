import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Pressable, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './src/service/api'; // Certifique-se de que o arquivo api.js está configurado corretamente

export default function LoginVenda({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      // Faz a requisição para o backend
      const response = await api.post('/auth/login', { email, password });

      // Verifica se o usuário tem permissão para acessar a área de vendedores
      if (!response.data.isSeller) {
        Alert.alert('Erro', 'Você não tem permissão para acessar esta área.');
        return;
      }

      // Armazena o token no AsyncStorage
      await AsyncStorage.setItem('userToken', response.data.token);

      // Navega para o Dashboard
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error(error);

      // Tratamento de erros
      if (error.response?.status === 401) {
        Alert.alert('Erro', 'Credenciais inválidas.');
      } else if (error.response?.status === 404) {
        Alert.alert('Erro', 'Usuário não encontrado.');
      } else {
        Alert.alert('Erro', 'Erro ao conectar ao servidor.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('./assets/ImageLogin.png')} style={styles.image} />
      <Text style={styles.title}>Login - Vendedor</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          underlineColorAndroid="transparent"
        />
      </View>
      <Pressable style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
      </Pressable>
      <TouchableOpacity style={styles.continueButton} onPress={handleLogin}>
        <Text style={styles.continueButtonText}>Entrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
    color: '#666',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
    borderWidth: 0,
    fontFamily: 'Arial',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  continueButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#0FC2C0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});