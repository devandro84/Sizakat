import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeDatabase } from './src/utils/database';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import PinLoginScreen from './src/screens/PinLoginScreen';
import PaymentPage from './src/pages/PaymentPage';
import ReportsPage from './src/pages/ReportsPage';
import RecipientsPage from './src/pages/RecipientsPage';
import NiatZakat from './src/pages/NiatZakat';
import ZakatMalPage from './src/pages/ZakatMalPage';
import ZakatPenghasilanPage from './src/pages/ZakatPenghasilanPage';
import SettingsPage from './src/pages/SettingsPage';
import KurbanPage from './src/pages/KurbanPage';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // Initialize database when app starts
    initializeDatabase();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#16a34a',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'SiZakat' }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PinLogin" 
            component={PinLoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Payment" 
            component={PaymentPage} 
            options={{ title: 'Pembayaran Zakat Fitrah' }}
          />
          <Stack.Screen 
            name="Reports" 
            component={ReportsPage} 
            options={{ title: 'Laporan Zakat' }}
          />
          <Stack.Screen 
            name="Recipients" 
            component={RecipientsPage} 
            options={{ title: 'Penerima Zakat' }}
          />
          <Stack.Screen 
            name="NiatZakat" 
            component={NiatZakat} 
            options={{ title: 'Niat & Ijab Kabul Zakat' }}
          />
          <Stack.Screen 
            name="ZakatMal" 
            component={ZakatMalPage} 
            options={{ title: 'Zakat Māl (Harta)' }}
          />
          <Stack.Screen 
            name="ZakatPenghasilan" 
            component={ZakatPenghasilanPage} 
            options={{ title: 'Zakat Penghasilan' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsPage} 
            options={{ title: 'Pengaturan' }}
          />
          <Stack.Screen 
            name="Kurban" 
            component={KurbanPage} 
            options={{ title: 'Kurban' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}