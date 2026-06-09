import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@MiniStock:token';
let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    let message = 'Não foi possível concluir a operação.';

    if (error.code === 'ECONNABORTED' || !error.response) {
      message = 'Sem conexão, tente novamente.';
    } else if (error.response.status === 401) {
      await AsyncStorage.removeItem(TOKEN_KEY);
      if (unauthorizedHandler) unauthorizedHandler();
      message = 'Sessão expirada. Faça login novamente.';
    } else if (error.response.status === 404) {
      message = 'Recurso não encontrado.';
    } else if (error.response.status >= 500) {
      message = 'Erro no servidor, tente novamente.';
    } else if (error.response.data?.message) {
      message = error.response.data.message;
    }

    return Promise.reject(new Error(message));
  }
);

export { TOKEN_KEY };
