import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, TOKEN_KEY } from './api';

export async function login(username, password) {
  const { data } = await api.post('/auth/login', {
    username,
    password,
    expiresInMins: 60,
  });

  const token = data.accessToken || data.token;
  if (!token) {
    throw new Error('Token não retornado pela API.');
  }

  await AsyncStorage.setItem(TOKEN_KEY, token);
  return { token, user: data };
}

export async function getStoredToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function logout() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}
