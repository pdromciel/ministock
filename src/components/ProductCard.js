import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
export default function ProductCard({ product, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: product.thumbnail || product.images?.[0] || 'https://placehold.co/120x120/png' }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
        <Text style={styles.category}>{product.category}</Text>
        <View style={styles.row}><Text style={styles.price}>US$ {Number(product.price || 0).toFixed(2)}</Text><Text style={styles.stock}>Estoque: {product.stock ?? 0}</Text></View>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({ card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, padding: 12, marginHorizontal: 16, marginVertical: 7, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }, image: { width: 78, height: 78, borderRadius: 10, backgroundColor: '#e2e8f0' }, info: { flex: 1, marginLeft: 12, justifyContent: 'space-between' }, title: { color: '#0f172a', fontWeight: '700', fontSize: 16 }, category: { color: '#64748b', textTransform: 'capitalize' }, row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, price: { color: '#1e40af', fontWeight: '800' }, stock: { color: '#475569', fontSize: 12 } });
