import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
export default function EmptyState({ title = 'Nada encontrado', message = 'Tente atualizar ou mudar os filtros.' }) {
  return <View style={styles.container}><Text style={styles.title}>{title}</Text><Text style={styles.message}>{message}</Text></View>;
}
const styles = StyleSheet.create({ container: { alignItems: 'center', justifyContent: 'center', padding: 28 }, title: { fontWeight: '700', color: '#0f172a', fontSize: 18 }, message: { marginTop: 6, textAlign: 'center', color: '#64748b' } });
