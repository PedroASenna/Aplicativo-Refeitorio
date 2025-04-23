import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const AnimatedFlatList = Animated.createAnimatedComponent(Animated.FlatList);

const Dashboard = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const [products] = useState([
    { id: 1, name: 'Pão Francês', price: 'R$ 0,50', rating: 5, votes: 18 },
    { id: 2, name: 'Bolo de Chocolate', price: 'R$ 15,00', rating: 5, votes: 24 },
    { id: 3, name: 'Croissant', price: 'R$ 4,50', rating: 4, votes: 32 },
    { id: 4, name: 'Torta de Frango', price: 'R$ 8,00', rating: 5, votes: 19 },
    { id: 5, name: 'Café Especial', price: 'R$ 5,00', rating: 4, votes: 45 },
    { id: 6, name: 'Sonho', price: 'R$ 3,50', rating: 5, votes: 27 },
    { id: 7, name: 'Pão de Queijo', price: 'R$ 1,00', rating: 5, votes: 63 },
    { id: 8, name: 'Biscoito Caseiro', price: 'R$ 2,50', rating: 4, votes: 38 },
    { id: 9, name: 'Suco Natural', price: 'R$ 6,00', rating: 4, votes: 41 },
    { id: 10, name: 'Empada', price: 'R$ 3,00', rating: 5, votes: 29 },
  ]);

  const [filteredProducts, setFilteredProducts] = useState(products);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchQuery]);

  const renderItem = ({ item }) => {
    return (
      <Animated.View style={styles.productCard}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.productImage}
        />

        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.stars}>{'★★★★★'}</Text>
            <Text style={styles.recommended}>Recommended</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.price}>{item.price}</Text>
            <Text style={styles.votes}>{item.votes} votes</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.cartButton}>
          <Icon name="add-shopping-cart" size={24} color="#0FC2C0" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Botão de 3 pontinhos */}
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
          <Icon name="more-vert" size={28} color="#000" />
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="Search for Shops and Restaurants"
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Carrinho')}
          style={styles.cartIcon}
        >
          <Icon name="shopping-cart" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Modal do Menu */}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuModal}>
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Conta');
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Conta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Configuracoes');
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Configurações</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Sobre');
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Sobre</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Lista de Produtos */}
      <AnimatedFlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
  },
  menuButton: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    fontSize: 16,
    marginRight: 15,
  },
  cartIcon: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 60,
    paddingLeft: 15,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menuModal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    width: 180,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stars: {
    color: '#FFD700',
    fontSize: 16,
    marginRight: 10,
  },
  recommended: {
    color: '#0FC2C0',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginRight: 15,
  },
  votes: {
    fontSize: 14,
    color: '#666',
  },
  cartButton: {
    padding: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default Dashboard;
