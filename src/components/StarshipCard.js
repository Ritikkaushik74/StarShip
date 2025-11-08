import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addToCart, removeFromCart, selectCartItemQuantity } from '../features/cart/cartSlice';
import { creditsToAED, formatAED } from '../utils/currency';

const StarshipCard = ({ starship }) => {
  const dispatch = useDispatch();
  const quantity = useSelector((state) => selectCartItemQuantity(state, starship.id));
  const [isProcessing, setIsProcessing] = useState(false);

  const price = creditsToAED(starship.cost_in_credits);
  console.log('Converted price:', price);
  const isPriceValid = typeof price === 'number';
  const maxQuantity = 5;
  const credits = starship.cost_in_credits;

  const handleActionWithDebounce = (action) => {
    if (isProcessing) return;

    setIsProcessing(true);
    action();

    setTimeout(() => setIsProcessing(false), 300);
  };

  const handleAddToCart = () => {
    handleActionWithDebounce(() => {
      if (isPriceValid) {
        dispatch(addToCart(starship));
      }
    });
  };

  const handleIncrement = () => {
    handleActionWithDebounce(() => {
      if (quantity < maxQuantity) {
        dispatch(addToCart(starship));
      }
    });
  };

  const handleDecrement = () => {
    handleActionWithDebounce(() => {
      if (quantity > 0) {
        dispatch(removeFromCart(starship.id));
      }
    });
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: `https://picsum.photos/seed/${starship.id}/200/120` }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {starship.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {formatAED(price)}
          </Text>
          {isPriceValid && (
            <Text style={styles.credits}>
              {typeof credits === 'string' && credits !== 'unknown'
                ? `${credits} credits`
                : credits !== 'unknown' ? `${credits.toLocaleString()} credits` : ''}
            </Text>
          )}
        </View>

        {isPriceValid ? (
          <>
            {quantity === 0 ? (
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={handleAddToCart}
                disabled={isProcessing}
                activeOpacity={0.8}
              >
                <Icon name="cart-plus" size={20} color="#fff" />
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.quantitySection}>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={handleDecrement}
                    disabled={isProcessing}
                    activeOpacity={0.7}
                  >
                    <Icon name="minus" size={18} color="#2196F3" />
                  </TouchableOpacity>

                  <View style={styles.quantityBadge}>
                    <Text style={styles.quantityText}>{quantity}</Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.quantityButton,
                      quantity >= maxQuantity && styles.quantityButtonDisabled,
                    ]}
                    onPress={handleIncrement}
                    disabled={quantity >= maxQuantity || isProcessing}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name="plus"
                      size={18}
                      color={quantity >= maxQuantity ? '#ccc' : '#2196F3'}
                    />
                  </TouchableOpacity>
                </View>

                {quantity >= maxQuantity && (
                  <Text style={styles.maxLimitText}>Max limit reached</Text>
                )}
              </View>
            )}
          </>
        ) : (
          <View style={styles.unavailableContainer}>
            <Icon name="alert-circle-outline" size={18} color="#f44336" />
            <Text style={styles.unavailableText}>Price Unavailable</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  priceContainer: {
    marginBottom: 16,
  },
  price: {
    fontSize: 15,
    color: '#2196F3',
    fontWeight: '700',
    marginBottom: 4
  },
  credits: {
    fontSize: 17,
    color: '#FF9800',
    fontWeight: '600',
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  quantitySection: {
    gap: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  quantityButton: {
    backgroundColor: '#E3F2FD',
    width: 36,
    height: 36,
    borderRadius: 18,
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
    minWidth: 50,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  maxLimitText: {
    fontSize: 12,
    color: '#f44336',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  unavailableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    gap: 6,
  },
  unavailableText: {
    color: '#f44336',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default StarshipCard;
