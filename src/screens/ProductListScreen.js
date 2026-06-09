import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { listCategories, listProducts, listProductsByCategory, searchProducts } from '../services/products';
import { useAuth } from '../contexts/AuthContext';
import { useProductsStore } from '../contexts/ProductContext';

const LIMIT = 10;

export default function ProductListScreen({ navigation, route }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const { signOut } = useAuth();
  const { version, applyLocalChanges } = useProductsStore();

  const canLoadMore = products.length < total;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Pressable onPress={signOut}><Text style={styles.headerAction}>Sair</Text></Pressable>,
    });
  }, [navigation, signOut]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await listCategories();
        setCategories(data);
      } catch (error) {
        setError(error.message);
      } finally {
        // categorias não bloqueiam a tela
      }
    }
    loadCategories();
  }, []);

  const fetchProducts = useCallback(async ({ reset = false, nextSkip = 0, silent = false } = {}) => {
    try {
      if (!silent) reset ? setLoading(true) : setLoadingMore(true);
      setError('');
      let data;
      if (search.trim()) {
        data = await searchProducts({ q: search.trim(), limit: LIMIT, skip: nextSkip });
      } else if (category) {
        data = await listProductsByCategory({ category, limit: LIMIT, skip: nextSkip });
      } else {
        data = await listProducts({ limit: LIMIT, skip: nextSkip });
      }

      const productsWithLocalChanges = applyLocalChanges(data.products, { search, category });
      setProducts((current) => reset ? productsWithLocalChanges : applyLocalChanges([...current, ...data.products], { search, category }));
      setTotal(data.total || 0);
      setSkip(nextSkip + LIMIT);
    } catch (error) {
      setError(error.message);
      if (reset) setProducts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [category, search, applyLocalChanges]);

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts({ reset: true, nextSkip: 0 }), 350);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  useEffect(() => {
    setProducts((current) => applyLocalChanges(current, { search, category }));
  }, [version, applyLocalChanges, search, category]);

  const selectedLabel = useMemo(() => category ? category.replaceAll('-', ' ') : 'Todas', [category]);

  function handleRefresh() {
    setRefreshing(true);
    fetchProducts({ reset: true, nextSkip: 0, silent: true });
  }

  function handleEndReached() {
    if (!loading && !loadingMore && canLoadMore) fetchProducts({ reset: false, nextSkip: skip });
  }

  function handleCategoryPress(value) {
    setCategory(value);
    setSearch('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <TextInput style={styles.search} placeholder="Buscar produto..." value={search} onChangeText={(text) => { setSearch(text); setCategory(''); }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
          <Pressable style={[styles.chip, !category && styles.chipSelected]} onPress={() => handleCategoryPress('')}><Text style={[styles.chipText, !category && styles.chipTextSelected]}>Todas</Text></Pressable>
          {categories.map((item) => (
            <Pressable key={item} style={[styles.chip, category === item && styles.chipSelected]} onPress={() => handleCategoryPress(item)}>
              <Text style={[styles.chipText, category === item && styles.chipTextSelected]}>{item.replaceAll('-', ' ')}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {!!category && <Text style={styles.filterInfo}>Categoria: {selectedLabel}</Text>}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? <ActivityIndicator style={styles.loading} size="large" color="#1e40af" /> : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ProductCard product={item} onPress={() => navigation.navigate('ProductDetail', { product: item })} />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          ListEmptyComponent={<EmptyState message="Nenhum produto encontrado para os filtros informados." />}
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ margin: 18 }} color="#1e40af" /> : null}
          contentContainerStyle={products.length === 0 ? styles.emptyContent : styles.listContent}
        />
      )}
      <Pressable style={styles.fab} onPress={() => navigation.navigate('ProductForm')}><Text style={styles.fabText}>+</Text></Pressable>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#f1f5f9' }, headerAction: { color: '#fff', fontWeight: '800', padding: 8 }, filters: { backgroundColor: '#fff', padding: 16, borderBottomColor: '#e2e8f0', borderBottomWidth: 1 }, search: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, backgroundColor: '#f8fafc', padding: 12, fontSize: 15 }, categoryList: { paddingTop: 12, gap: 8 }, chip: { borderWidth: 1, borderColor: '#bfdbfe', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, marginRight: 8 }, chipSelected: { backgroundColor: '#1e40af', borderColor: '#1e40af' }, chipText: { color: '#1e40af', textTransform: 'capitalize' }, chipTextSelected: { color: '#fff', fontWeight: '700' }, filterInfo: { marginTop: 8, color: '#64748b' }, error: { color: '#b91c1c', backgroundColor: '#fee2e2', padding: 10, margin: 16, borderRadius: 10 }, loading: { marginTop: 50 }, emptyContent: { flexGrow: 1, justifyContent: 'center' }, listContent: { paddingVertical: 8, paddingBottom: 96 }, fab: { position: 'absolute', right: 20, bottom: 24, width: 58, height: 58, borderRadius: 29, backgroundColor: '#1e40af', alignItems: 'center', justifyContent: 'center', elevation: 5 }, fabText: { color: '#fff', fontSize: 34, marginTop: -2 } });
