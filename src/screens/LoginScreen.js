import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Informe usuário e senha.');
      return;
    }
    try {
      setLoading(true);
      await signIn(username.trim(), password);
    } catch (error) {
      Alert.alert('Erro no login', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>MiniStock</Text>
        <Text style={styles.subtitle}>Controle de produtos no celular</Text>
        <TextInput style={styles.input} placeholder="Usuário" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
        <Pressable style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
        </Pressable>
        <Text style={styles.helper}>Teste: emilys / emilyspass</Text>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#1e40af', justifyContent: 'center', padding: 22 }, card: { backgroundColor: '#fff', borderRadius: 22, padding: 24, elevation: 4 }, logo: { fontSize: 34, fontWeight: '900', color: '#1e40af', textAlign: 'center' }, subtitle: { color: '#64748b', textAlign: 'center', marginBottom: 24, marginTop: 4 }, input: { backgroundColor: '#f8fafc', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 12, fontSize: 16 }, button: { backgroundColor: '#1e40af', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 4 }, buttonDisabled: { opacity: 0.7 }, buttonText: { color: '#fff', fontWeight: '800', fontSize: 16 }, helper: { marginTop: 14, textAlign: 'center', color: '#64748b' } });
