import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchStarships } from '../features/starships/starshipsSlice';
import { loadCredits, selectTotalCredits } from '../features/credits/creditsSlice';
import StarshipCard from '../components/StarshipCard';
import StickyCartBar from '../components/StickyCartBar';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.starships);
  const totalCredits = useSelector(selectTotalCredits);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    dispatch(fetchStarships(1));
    dispatch(loadCredits());
  }, [dispatch]);

  const renderItem = ({ item }) => <StarshipCard starship={item} />;

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) }]}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.headerTitle}>Starship Shop</Text>
          <Text style={styles.headerSubtitle}>Browse our collection of Star Wars starships</Text>
        </View>
        <View style={styles.creditsContainer}>
          <Icon name="star-circle" size={24} color="#FFD700" />
          <View style={styles.creditsInfo}>
            <Text style={styles.creditsLabel}>Your Credits</Text>
            <Text style={styles.creditsValue}>{totalCredits.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading && items.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading starships...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <StickyCartBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#2196F3',
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  creditsInfo: {
    alignItems: 'flex-end',
    
  },
  creditsLabel: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 2,
  },
  creditsValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFD700',
  },
  listContent: {
    paddingBottom: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
