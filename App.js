import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import Loading from './src/components/Loading';
import { setUnauthorizedHandler } from './src/services/api';

function Routes() {
  const { userToken, initializing, signOut } = useAuth();

  React.useEffect(() => {
    setUnauthorizedHandler(signOut);
  }, [signOut]);

  if (initializing) {
    return <Loading message="Carregando sessão..." />;
  }

  return userToken ? <AppNavigator /> : <AuthNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Routes />
      </NavigationContainer>
    </AuthProvider>
  );
}
