import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Pressable, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';
import { API_URL } from '@env';
import app from './src/firebaseConfig'; // Certifique-se de que o arquivo firebaseConfig.js está configurado corretamente

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '844595082512-jl9hljhmie8kmrsjnmvpuiafj6osqu8p.apps.googleusercontent.com',
    androidClientId: '844595082512-jl9hljhmie8kmrsjnmvpuiafj6osqu8p.apps.googleusercontent.com',
    iosClientId: '844595082512-jl9hljhmie8kmrsjnmvpuiafj6osqu8p.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@pedroasenna/mobifood', // Força o uso do URI do Expo
  });

  const handleGoogleLogin = async () => {
    console.log('Iniciando login com Google...');
    if (response?.type === 'success') {
      console.log('Resposta de sucesso:', response);
      const { id_token } = response.authentication;
      const auth = getAuth(app);
      const credential = GoogleAuthProvider.credential(id_token);

      try {
        const result = await signInWithCredential(auth, credential);
        const user = result.user;

        console.log('Usuário autenticado:', user);

        // Armazena o token do usuário no AsyncStorage
        await AsyncStorage.setItem('userToken', user.accessToken);

        Alert.alert('Login bem-sucedido!', `Bem-vindo, ${user.displayName}`);
        navigation.navigate('Dashboard');
      } catch (error) {
        console.error('Erro ao autenticar com Google:', error);
        Alert.alert('Erro', 'Não foi possível fazer login com Google.');
      }
    } else {
      console.log('Resposta inválida:', response);
      promptAsync();
    }
  };

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

      // Armazena o token no AsyncStorage
      await AsyncStorage.setItem('userToken', response.data.token);

      // Navega para o Dashboard
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Erro ao fazer login:', error);

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
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email ou Telefone"
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
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Ionicons name="logo-google" size={20} color="#fff" style={styles.googleIcon} />
        <Text style={styles.googleButtonText}>Login com Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.continueButton} onPress={handleLogin}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#0FC2C0',
    borderRadius: 8,
    marginBottom: 15,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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