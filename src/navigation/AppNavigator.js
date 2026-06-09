import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProductFormScreen from '../screens/ProductFormScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1e40af' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'MiniStock' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Detalhes' }} />
      <Stack.Screen name="ProductForm" component={ProductFormScreen} options={({ route }) => ({ title: route.params?.product ? 'Editar produto' : 'Novo produto' })} />
    </Stack.Navigator>
  );
}
