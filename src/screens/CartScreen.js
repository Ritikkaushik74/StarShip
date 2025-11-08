import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  selectCartItemsArray,
  selectTotalPrice,
  clearCart,
  addToCart,
  removeFromCart,
} from '../features/cart/cartSlice';
import {
  addCredits,
  saveCredits,
  selectTotalCredits,
} from '../features/credits/creditsSlice';
import { creditsToAED, formatAED } from '../utils/currency';
import CartSummary from '../components/CartSummary';

const CartScreen = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItemsArray);
  const totalPrice = useSelector(selectTotalPrice);
  const currentCredits = useSelector(selectTotalCredits);
  const insets = useSafeAreaInsets();
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = ['Credit Card', 'PayPal'];

  const handlePlaceOrder = () => {
    if (isPlacingOrder || isProcessing) return;

    if (cartItems.length === 0) {
      Alert.alert(
        'Cart Empty',
        'Please add items to your cart before placing an order.',
      );
      return;
    }

    setIsPlacingOrder(true);

    const total = totalPrice + totalPrice * 0.05;
    const creditsEarned = Math.round(total * 10000);

    setTimeout(() => {
      const newTotalCredits = currentCredits + creditsEarned;
      dispatch(addCredits(creditsEarned));
      dispatch(saveCredits(newTotalCredits));

      Alert.alert(
        '✅ Order Placed Successfully!',
        `Your order has been placed using ${paymentMethod}.\n\nTotal: ${formatAED(
          total,
        )}\n\n🎉 You earned ${creditsEarned.toLocaleString()} credits!\n\nThank you for shopping with Starship Shop!`,
        [
          {
            text: 'Continue Shopping',
            onPress: () => {
              dispatch(clearCart());
              setIsPlacingOrder(false);
            },
          },
        ],
        { cancelable: false },
      );
    }, 800);
  };

  const handleQuantityChange = (starship, action) => {
    if (isProcessing) return;

    setIsProcessing(true);

    if (action === 'add') {
      dispatch(addToCart(starship));
    } else {
      dispatch(removeFromCart(starship.id));
    }

    setTimeout(() => setIsProcessing(false), 200);
  };

  const renderCartItem = ({ item }) => {
    const { starship, quantity } = item;
    const price = creditsToAED(starship.cost_in_credits);
    const subtotal = price * quantity;
    const credits = starship.cost_in_credits;

    return (
      <View style={styles.cartItem}>
        <Image
          source={{ uri: `https://picsum.photos/seed/${starship.id}/200/120` }}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={2}>
            {starship.name}
          </Text>
          <View style={styles.itemPriceContainer}>
            <Text style={styles.itemPrice}>{formatAED(price)} each</Text>
            {typeof price === 'number' && (
              <Text style={styles.itemCredits}>
                {typeof credits === 'string' && credits !== 'unknown'
                  ? `${credits} credits`
                  : credits !== 'unknown'
                  ? `${credits.toLocaleString()} credits`
                  : ''}
              </Text>
            )}
          </View>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(starship, 'remove')}
              disabled={isProcessing}
              activeOpacity={0.7}
            >
              <Icon name="minus" size={14} color="#2196F3" />
            </TouchableOpacity>

            <View style={styles.quantityBadge}>
              <Text style={styles.itemQuantity}>{quantity}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.quantityButton,
                quantity >= 5 && styles.quantityButtonDisabled,
              ]}
              onPress={() => handleQuantityChange(starship, 'add')}
              disabled={quantity >= 5 || isProcessing}
              activeOpacity={0.7}
            >
              <Icon
                name="plus"
                size={14}
                color={quantity >= 5 ? '#ccc' : '#2196F3'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <Text style={styles.subtotalValue}>{formatAED(subtotal)}</Text>
        </View>
      </View>
    );
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Icon name="cart-outline" size={100} color="#e0e0e0" />
      <Text style={styles.emptyText}>Your cart is empty</Text>
      <Text style={styles.emptySubtext}>
        Add some starships to get started!
      </Text>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
          <Icon name="cart" size={24} color="#fff" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Shopping Cart</Text>
        </View>
        {renderEmptyCart()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
          <View style={styles.headerContent}>
            <Icon
              name="cart"
              size={24}
              color="#fff"
              style={styles.headerIcon}
            />
            <Text style={styles.headerTitle}>Shopping Cart</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{cartItems.length} items</Text>
          </View>
        </View>

        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={item => item.starship.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.checkoutContainer}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethodsContainer}>
            {paymentMethods.map(method => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.paymentMethodButton,
                  paymentMethod === method && styles.paymentMethodButtonActive,
                ]}
                onPress={() => setPaymentMethod(method)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.radio,
                    paymentMethod === method && styles.radioActive,
                  ]}
                >
                  {paymentMethod === method && (
                    <Icon name="check" size={12} color="#fff" />
                  )}
                </View>
                <Icon
                  name={
                    method === 'Credit Card'
                      ? 'credit-card'
                      : 'contactless-payment'
                  }
                  size={18}
                  color={paymentMethod === method ? '#2196F3' : '#666'}
                  style={styles.paymentIcon}
                />
                <Text
                  style={[
                    styles.paymentMethodText,
                    paymentMethod === method && styles.paymentMethodTextActive,
                  ]}
                >
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <CartSummary subtotal={totalPrice} />

          <TouchableOpacity
            style={[
              styles.placeOrderButton,
              isPlacingOrder && styles.placeOrderButtonDisabled,
            ]}
            onPress={handlePlaceOrder}
            disabled={isPlacingOrder}
            activeOpacity={0.8}
          >
            {isPlacingOrder ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.placeOrderButtonText}>Processing...</Text>
              </>
            ) : (
              <>
                <Icon name="check-circle" size={20} color="#fff" />
                <Text style={styles.placeOrderButtonText}>Place Order</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  headerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    padding: 12,
  },
  cartItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  itemPriceContainer: {
    marginVertical: 2,
  },
  itemPrice: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  itemCredits: {
    fontSize: 11,
    color: '#FF9800',
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quantityButton: {
    backgroundColor: '#E3F2FD',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  quantityButtonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  quantityBadge: {
    backgroundColor: '#2196F3',
    minWidth: 28,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  itemQuantity: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  subtotalContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  subtotalLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  subtotalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  checkoutContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  paymentMethodsContainer: {
    marginBottom: 6,
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: '#f5f5f5',
  },
  paymentMethodButtonActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: '#2196F3',
    backgroundColor: '#2196F3',
  },
  paymentIcon: {
    marginRight: 8,
  },
  paymentMethodText: {
    fontSize: 15,
    color: '#666',
    flex: 1,
  },
  paymentMethodTextActive: {
    color: '#2196F3',
    fontWeight: '600',
  },
  placeOrderButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#9E9E9E',
    shadowOpacity: 0,
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default CartScreen;
