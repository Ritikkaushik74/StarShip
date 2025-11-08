import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatAED } from '../utils/currency';

const CartSummary = ({ subtotal }) => {
  const taxRate = 0.05; // 5% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  const creditsEarned = Math.round(total * 10000); // Convert AED to credits for rewards

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Subtotal:</Text>
        <Text style={styles.value}>{formatAED(subtotal)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Tax (5%):</Text>
        <Text style={styles.value}>{formatAED(tax)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>{formatAED(total)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.pointsContainer}>
        <Icon name="star-circle" size={20} color="#FF9800" />
        <Text style={styles.pointsLabel}>Points Earned:</Text>
        <Text style={styles.pointsValue}>{creditsEarned.toLocaleString()} credits</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2196F3',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  pointsLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E65100',
    flex: 1,
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF9800',
  },
});

export default CartSummary;
