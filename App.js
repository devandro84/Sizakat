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
import RecipientsScreen from './src/screens/RecipientsScreen';
import NiatZakatScreen from './src/screens/NiatZakatScreen';
import ZakatMalScreen from './src/screens/ZakatMalScreen';
import ZakatPenghasilanScreen from './src/screens/ZakatPenghasilanScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import KurbanScreen from './src/screens/KurbanScreen';

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
            component={RecipientsScreen} 
            options={{ title: 'Penerima Zakat' }}
          />
          <Stack.Screen 
            name="NiatZakat" 
            component={NiatZakatScreen} 
            options={{ title: 'Niat & Ijab Kabul Zakat' }}
          />
          <Stack.Screen 
            name="ZakatMal" 
            component={ZakatMalScreen} 
            options={{ title: 'Zakat Māl (Harta)' }}
          />
          <Stack.Screen 
            name="ZakatPenghasilan" 
            component={ZakatPenghasilanScreen} 
            options={{ title: 'Zakat Penghasilan' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ title: 'Pengaturan' }}
          />
          <Stack.Screen 
            name="Kurban" 
            component={KurbanScreen} 
            options={{ title: 'Kurban' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}