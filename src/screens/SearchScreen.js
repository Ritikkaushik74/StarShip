import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { searchStarships, clearSearchResults } from '../features/starships/starshipsSlice';
import { selectTotalCredits } from '../features/credits/creditsSlice';
import StarshipCard from '../components/StarshipCard';
import StickyCartBar from '../components/StickyCartBar';

const SearchScreen = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { searchResults, searchLoading, searchError } = useSelector((state) => state.starships);
  const totalCredits = useSelector(selectTotalCredits);
  const searchTimeoutRef = useRef(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      dispatch(clearSearchResults());
      setIsSearching(false);
      return;
    }

    if (trimmedQuery.length < 2) {
      return;
    }

    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(() => {
      dispatch(searchStarships(trimmedQuery));
      setIsSearching(false);
    }, 600);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, dispatch]);

  const renderItem = ({ item }) => <StarshipCard starship={item} />;

  const renderEmptyState = () => {
    if (isSearching || searchLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.emptyText}>Searching...</Text>
        </View>
      );
    }

    if (searchError) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="alert-circle" size={64} color="#f44336" />
          <Text style={styles.errorText}>Oops! Something went wrong</Text>
          <Text style={styles.emptySubtext}>{searchError}</Text>
        </View>
      );
    }

    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery && trimmedQuery.length < 2) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="text-search" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Type at least 2 characters</Text>
          <Text style={styles.emptySubtext}>We need more letters to search</Text>
        </View>
      );
    }

    if (trimmedQuery && searchResults.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="rocket-launch-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No starships found</Text>
          <Text style={styles.emptySubtext}>Try searching for "X-wing" or "Death Star"</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Icon name="magnify" size={64} color="#2196F3" />
        <Text style={styles.emptyText}>Search for starships</Text>
        <Text style={styles.emptySubtext}>Enter a name to find your favorite starship</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) }]}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Search Starships</Text>
          <View style={styles.creditsContainer}>
            <Icon name="star-circle" size={20} color="#FFD700" />
            <View style={styles.creditsInfo}>
              <Text style={styles.creditsValue}>{totalCredits.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Icon name="magnify" size={24} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search starships (e.g. X-wing, Falcon)..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Icon
              name="close-circle"
              size={24}
              color="#999"
              style={styles.clearIcon}
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>
        {isSearching && (
          <View style={styles.searchingIndicator}>
            <ActivityIndicator size="small" color="#2196F3" />
          </View>
        )}
      </View>

      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
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
  header: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  creditsInfo: {
    alignItems: 'center',
  },
  creditsValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD700',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearIcon: {
    marginLeft: 8,
    padding: 4,
  },
  searchingIndicator: {
    position: 'absolute',
    right: 20,
    top: 24,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f44336',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
});

export default SearchScreen;
