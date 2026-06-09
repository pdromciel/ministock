import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { createProduct, updateProduct } from '../services/products';

export default function ProductFormScreen({ navigation, route }) {
  const product = route.params?.product;
  const isEditing = Boolean(product);
  const [title, setTitle] = useState(product?.title || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price ? String(product.price) : '');
  const [category, setCategory] = useState(product?.category || '');
  const [stock, setStock] = useState(product?.stock !== undefined ? String(product.stock) : '');
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!title.trim() || !description.trim() || !price.trim() || !category.trim() || !stock.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return false;
    }
    if (Number.isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Atenção', 'Informe um preço válido.');
      return false;
    }
    if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
      Alert.alert('Atenção', 'Informe um estoque válido.');
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;
    const payload = {
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim().toLowerCase(),
      stock: Number(stock),
      thumbnail: product?.thumbnail || 'https://placehold.co/600x400/png?text=MiniStock',
    };

    try {
      setLoading(true);
      if (isEditing) {
        const updated = await updateProduct(product.id, payload);
        const merged = { ...product, ...payload, ...updated };
        navigation.navigate('ProductDetail', { product: merged, updatedProduct: merged });
        navigation.navigate('ProductList', { updatedProduct: merged });
      } else {
        const created = await createProduct(payload);
        const newProduct = { ...payload, ...created, id: created.id || Date.now() };
        navigation.navigate('ProductList', { createdProduct: newProduct });
      }
    } catch (error) {
      Alert.alert('Erro ao salvar', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Título</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ex: Smartphone" />
        <Text style={styles.label}>Descrição</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Descrição do produto" multiline />
        <Text style={styles.label}>Preço</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="99.90" keyboardType="decimal-pad" />
        <Text style={styles.label}>Categoria</Text>
        <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="beauty, groceries..." autoCapitalize="none" />
        <Text style={styles.label}>Estoque</Text>
        <TextInput style={styles.input} value={stock} onChangeText={setStock} placeholder="10" keyboardType="number-pad" />
        <Pressable style={[styles.button, loading && styles.disabled]} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Cadastrar produto'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#f1f5f9' }, content: { padding: 18 }, label: { color: '#0f172a', fontWeight: '800', marginBottom: 6, marginTop: 10 }, input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 14, fontSize: 16 }, textArea: { minHeight: 110, textAlignVertical: 'top' }, button: { backgroundColor: '#1e40af', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 }, disabled: { opacity: 0.75 }, buttonText: { color: '#fff', fontWeight: '900', fontSize: 16 } });
