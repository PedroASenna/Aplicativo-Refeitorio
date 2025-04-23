import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Pressable, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';
import { API_URL } from '@env';
import app from './src/firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '844595082512-jl9hljhmie8kmrsjnmvpuiafj6osqu8p.apps.googleusercontent.com',
    androidClientId: '844595082512-jl9hljhmie8kmrsjnmvpuiafj6osqu8p.apps.googleusercontent.com',
    iosClientId: '844595082512-jl9hljhmie8kmrsjnmvpuiafj6osqu8p.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@pedroasenna/mobile',
  });

  const handleLogin = async () => {
    console.log('Iniciando login com e-mail e senha...');
    if (email === '' || password === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      console.log('Enviando requisição para o backend...');
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });

      console.log('Resposta do backend:', response.data);
      await AsyncStorage.setItem('userToken', response.data.token);
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
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
      <Text style={styles.title}>Login</Text>
      
      {/* Campo de Email */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email ou Telefone"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      {/* Campo de Senha com "olhinho" */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons 
            name={showPassword ? "eye-off-outline" : "eye-outline"} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>

      {/* Botão "Esqueceu a senha?" */}
      <Pressable 
        style={styles.forgotPassword} 
        onPress={() => navigation.navigate('ResetSenha')}
      >
        <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
      </Pressable>

      {/* Botão de Login */}
      <TouchableOpacity style={styles.continueButton} onPress={handleLogin}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      {/* Link para Registro */}
      <View style={styles.registerContainer}>
        <Text>Não tem Login? </Text>
        <Pressable onPress={() => navigation.navigate('RegisterUser')}>
          <Text style={styles.registerText}>Registrar</Text>
        </Pressable>
      </View>
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
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
    padding: 8,
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
  registerContainer: {
    flexDirection: 'row',
    marginTop: 25,
  },
  registerText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});