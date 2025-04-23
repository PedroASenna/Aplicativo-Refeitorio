import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Carrinho = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho de Compras</Text>
      {/* Adicione os itens do carrinho aqui */}
    </View>
  );
};

const CartItem = ({ item, onIncrease, onDecrease }) => (
  <View style={styles.itemContainer}>
    <Image source={item.image} style={styles.itemImage} />
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>R$ {item.price.toFixed(2)}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          onPress={() => onDecrease(item.id)} 
          style={styles.quantityButton}
        >
          <Ionicons name="remove" size={20} color="#0FC2C0" />
        </TouchableOpacity>
        <Text style={styles.itemQuantity}>Quantidade: {item.quantity}</Text>
        <TouchableOpacity 
          onPress={() => onIncrease(item.id)} 
          style={styles.quantityButton}
        >
          <Ionicons name="add" size={20} color="#0FC2C0" />
        </TouchableOpacity>
      </View>
      <Text style={styles.itemSubtotal}>Subtotal: R$ {(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  </View>
);

export default function CartScreen({ route, navigation }) {
  const [cartItems, setCartItems] = useState(route?.params?.cartItems || []);
  const [total, setTotal] = useState(route?.params?.total || 0);
  const [showCardOptions, setShowCardOptions] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState({
    cash: false,
    pix: false,
    card: false
  });

  const handleIncreaseQuantity = (itemId) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedItems);
    updateTotal(updatedItems);
  };

  const handleDecreaseQuantity = (itemId) => {
    const updatedItems = cartItems
      .map(item => {
        if (item.id === itemId) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter(item => item.quantity > 0); // Remove o item se a quantidade chegar a 0
    
    setCartItems(updatedItems);
    updateTotal(updatedItems);
  };

  const updateTotal = (items) => {
    const newTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  };

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const handleAddMore = () => {
    navigation.goBack();
  };

  const handleCheckout = () => {
    console.log('Finalizar compra - Integração com back-end pendente');
  };

  const togglePaymentMethod = (method) => {
    setPaymentMethods(prev => ({
      cash: method === 'cash' ? !prev.cash : false,
      pix: method === 'pix' ? !prev.pix : false,
      card: method === 'card' ? !prev.card : false
    }));

    if (method !== 'card') {
      setShowCardOptions(false);
    } else if (!paymentMethods.card) {
      setShowCardOptions(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra superior */}
      <View style={styles.header}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Carrinho</Text>
          
          <View style={{ width: 30 }} />
        </View>
        <View style={styles.blueBar} />
      </View>

      {/* Lista de itens */}
      <ScrollView style={styles.itemsContainer}>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <CartItem 
              key={`cart-item-${item.id}`} 
              item={item} 
              onIncrease={handleIncreaseQuantity}
              onDecrease={handleDecreaseQuantity}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
        )}
      </ScrollView>

      {/* Resumo do pedido */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryDetails}>
          <Text style={styles.summaryText}>Total ({itemCount} {itemCount === 1 ? 'item' : 'itens'}):</Text>
          <Text style={styles.summaryTotal}>R$ {total.toFixed(2)}</Text>
        </View>

        {/* Seção de pagamento */}
        <View style={styles.paymentContainer}>
          <Text style={styles.paymentTitle}>Forma de pagamento</Text>
          
          {/* Opção Dinheiro */}
          <View style={styles.paymentMethodRow}>
            <View style={styles.paymentMethod}>
              <Ionicons name="cash-outline" size={24} color="#0FC2C0" />
              <Text style={styles.paymentText}>Dinheiro/Balcão</Text>
            </View>
            <Switch
              value={paymentMethods.cash}
              onValueChange={() => togglePaymentMethod('cash')}
              trackColor={{ false: "#767577", true: "#0FC2C0" }}
              thumbColor={paymentMethods.cash ? "#fff" : "#f4f3f4"}
            />
          </View>
          
          {/* Opção PIX */}
          <View style={styles.paymentMethodRow}>
            <View style={styles.paymentMethod}>
              <Image 
                source={require('../mobile/assets/PixIcon.png')} 
                style={styles.pixIcon} 
                resizeMode="contain"
              />
              <Text style={styles.paymentText}>PIX</Text>
            </View>
            <Switch
              value={paymentMethods.pix}
              onValueChange={() => togglePaymentMethod('pix')}
              trackColor={{ false: "#767577", true: "#0FC2C0" }}
              thumbColor={paymentMethods.pix ? "#fff" : "#f4f3f4"}
            />
          </View>
          
          {/* Opção Cartão */}
          <View style={styles.paymentMethodRow}>
            <TouchableOpacity 
              style={styles.paymentMethod}
              onPress={() => {
                setShowCardOptions(!showCardOptions);
                togglePaymentMethod('card');
              }}
            >
              <Ionicons name="card-outline" size={24} color="#0FC2C0" />
              <Text style={styles.paymentText}>Cartão</Text>
              <Ionicons 
                name={showCardOptions ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color="#0FC2C0" 
                style={styles.chevronIcon}
              />
            </TouchableOpacity>
            <Switch
              value={paymentMethods.card}
              onValueChange={() => {
                togglePaymentMethod('card');
                if (!paymentMethods.card) setShowCardOptions(true);
                else setShowCardOptions(false);
              }}
              trackColor={{ false: "#767577", true: "#0FC2C0" }}
              thumbColor={paymentMethods.card ? "#fff" : "#f4f3f4"}
            />
          </View>
          
          {showCardOptions && paymentMethods.card && (
            <View style={styles.cardOptions}>
              <TouchableOpacity style={styles.addCardButton}>
                <Ionicons name="add-circle-outline" size={20} color="#0FC2C0" />
                <Text style={styles.addCardText}>Adicionar cartão</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.addMoreButton}
            onPress={handleAddMore}
          >
            <Text style={styles.addMoreText}>Quero Pedir Mais</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.checkoutButton, cartItems.length === 0 && styles.disabledButton]}
            onPress={handleCheckout}
            disabled={cartItems.length === 0}
          >
            <Text style={styles.checkoutText}>Finalizar Compra</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#0FC2C0',
    paddingBottom: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  blueBar: {
    height: 10,
    backgroundColor: '#0CABA8',
  },
  itemsContainer: {
    flex: 1,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  itemSubtotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0FC2C0',
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  summaryDetails: {
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
  },
  summaryTotal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0FC2C0',
  },
  paymentContainer: {
    marginBottom: 20,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    flex: 1,
  },
  paymentText: {
    fontSize: 16,
    marginLeft: 10,
  },
  pixIcon: {
    width: 24,
    height: 24,
  },
  chevronIcon: {
    marginRight: 10,
  },
  cardOptions: {
    marginLeft: 34,
    marginBottom: 10,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#0FC2C0',
    borderRadius: 8,
  },
  addCardText: {
    marginLeft: 10,
    color: '#0FC2C0',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addMoreButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0FC2C0',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  addMoreText: {
    color: '#0FC2C0',
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkoutButton: {
    flex: 1,
    backgroundColor: '#0FC2C0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0FC2C0',
    borderRadius: 15,
    marginHorizontal: 5,
  },
});
