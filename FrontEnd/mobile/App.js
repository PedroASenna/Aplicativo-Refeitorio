import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import LoginUser from './LoginUser'; 
import LoginVenda from './LoginVenda'; 
import Dashboard from './dashboard'; 
import SingInScreenUser from './SingInScreenUser'; 
import ResetSenha from './ResetSenha'; // Importação adicionada

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: '#0FC2C0',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

function UserTypeSelection({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quem é você?</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LoginUser')}
      >
        <Text style={styles.buttonText}>Cliente</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LoginVenda')}
      >
        <Text style={styles.buttonText}>Restaurante</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="UserTypeSelection" 
          component={UserTypeSelection} 
        />
        <Stack.Screen name="LoginUser" component={LoginUser} />
        <Stack.Screen name="LoginVenda" component={LoginVenda} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="RegisterUser" component={SingInScreenUser} />
        <Stack.Screen 
          name="ResetSenha" 
          component={ResetSenha} 
          options={{ title: 'Redefinir Senha' }} // Título da tela (se headerShown for true)
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}