import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Image 
} from 'react-native';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');

  const handleSend = () => {
    if (email === '') {
      Alert.alert('Erro', 'Preencha o campo para continuar.');
      return;
    }
    Alert.alert('Enviado', 'Seus dados de recuperação foram enviados.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require("../mobile/assets/ForgotPassword.png")} 
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Recuperar Senha</Text>

      <TextInput
        style={styles.input}
        placeholder="Email ou telefone"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Voltar para o Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#0FC2C0',
    textAlign: 'center',
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#0FC2C0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backText: {
    textAlign: 'center',
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
});