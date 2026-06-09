import { api } from './api';

export async function listProducts({ limit = 10, skip = 0 }) {
  const { data } = await api.get('/products', { params: { limit, skip } });
  return data;
}

export async function searchProducts({ q, limit = 10, skip = 0 }) {
  const { data } = await api.get('/products/search', { params: { q, limit, skip } });
  return data;
}

export async function listCategories() {
  const { data } = await api.get('/products/category-list');
  return data;
}

export async function listProductsByCategory({ category, limit = 10, skip = 0 }) {
  const { data } = await api.get(`/products/category/${category}`, { params: { limit, skip } });
  return data;
}

export async function getProductById(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

export async function createProduct(product) {
  const { data } = await api.post('/products/add', product);
  return data;
}

export async function updateProduct(id, product) {
  const { data } = await api.put(`/products/${id}`, product);
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}
