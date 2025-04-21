import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Dashboard({ navigation }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  // Verifica o token e carrega os dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Recupera o token do AsyncStorage
        const token = await AsyncStorage.getItem('userToken');
        console.log('Token recuperado:', token);

        if (!token) {
          Alert.alert('Erro', 'Você precisa fazer login novamente.');
          navigation.navigate('Login');
          return;
        }

        // Faz a requisição ao backend
        const response = await axios.get('http://192.168.29.164:5000/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Dados recebidos do backend:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error.response || error.message);

        if (error.response?.status === 401) {
          Alert.alert('Erro', 'Sessão expirada. Faça login novamente.');
          navigation.navigate('Login');
        } else {
          Alert.alert('Erro', 'Não foi possível carregar os dados. Tente novamente mais tarde.');
        }
      }
    };

    fetchData();
  }, []);

  // Filtra os produtos com base na pesquisa
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // Renderiza cada item da lista
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>💲 {item.price.toFixed(2)}</Text>
        <Text style={styles.subtitle}>⭐ {item.rating}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Dashboard</Text>
        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.cartText}>🛒</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for Products"
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cartButton: {
    backgroundColor: '#0FC2C0',
    borderRadius: 20,
    padding: 10,
  },
  cartText: {
    fontSize: 18,
    color: '#fff',
  },
  searchInput: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
});