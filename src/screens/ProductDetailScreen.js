import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { deleteProduct, getProductById } from '../services/products';
import { useProductsStore } from '../contexts/ProductContext';

export default function ProductDetailScreen({ navigation, route }) {
  const initialProduct = route.params?.product;

  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const { deleteLocalProduct } = useProductsStore();

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError('');

        const data = await getProductById(initialProduct.id);

        setProduct((current) => ({
          ...data,
          ...current,
        }));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (initialProduct?.id && initialProduct.id <= 194) {
      loadProduct();
    }
  }, [initialProduct]);

  useEffect(() => {
    if (route.params?.updatedProduct) {
      setProduct((current) => ({
        ...current,
        ...route.params.updatedProduct,
      }));

      navigation.setParams({ updatedProduct: undefined });
    }
  }, [route.params?.updatedProduct, navigation]);

  function confirmDelete() {
    Alert.alert('Excluir produto', `Deseja remover "${product.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: handleDelete },
    ]);
  }

  async function handleDelete() {
    try {
      setDeleting(true);

      await deleteProduct(product.id);
      deleteLocalProduct(product.id);

      Alert.alert('Sucesso', 'Produto removido da listagem.');
      navigation.navigate('ProductList');
    } catch (error) {
      Alert.alert('Erro ao excluir', error.message);
    } finally {
      setDeleting(false);
    }
  }

  if (loading && !product) {
    return (
      <ActivityIndicator
        style={{ marginTop: 60 }}
        size="large"
        color="#1e40af"
      />
    );
  }

  if (!product) {
    return <Text style={styles.error}>Produto não encontrado.</Text>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Image
        source={{
          uri:
            product.thumbnail ||
            product.images?.[0] ||
            'https://placehold.co/600x400/png',
        }}
        style={styles.image}
      />

      <View style={styles.card}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Preço</Text>
          <Text style={styles.value}>
            US$ {Number(product.price || 0).toFixed(2)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estoque</Text>
          <Text style={styles.value}>{product.stock ?? 0}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={[styles.button, styles.edit]}
            onPress={() => navigation.navigate('ProductForm', { product })}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.delete]}
            onPress={confirmDelete}
            disabled={deleting}
          >
            <Text style={styles.buttonText}>
              {deleting ? 'Excluindo...' : 'Excluir'}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
  },
  category: {
    color: '#1e40af',
    textTransform: 'capitalize',
    marginTop: 4,
    fontWeight: '700',
  },
  description: {
    color: '#475569',
    lineHeight: 22,
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: '#e2e8f0',
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  label: {
    color: '#64748b',
  },
  value: {
    color: '#0f172a',
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  edit: {
    backgroundColor: '#1e40af',
  },
  delete: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
  },
  error: {
    color: '#b91c1c',
    backgroundColor: '#fee2e2',
    padding: 12,
    margin: 16,
    borderRadius: 10,
  },
});