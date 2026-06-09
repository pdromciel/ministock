import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function Loading({ message = 'Carregando...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1e40af" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }, text: { marginTop: 12, color: '#475569' } });
