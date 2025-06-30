import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { getSettings } from '../utils/database';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const HomeScreen = ({ navigation }) => {
  const [settings, setSettings] = useState(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Load settings
    const loadedSettings = getSettings();
    setSettings(loadedSettings);

    // Update clock every second
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    
    return () => clearInterval(clockInterval);
  }, []);

  const menuItems = [
    { 
      id: 'zakatFitrah', 
      title: 'Zakat Fitrah', 
      icon: require('../assets/icons/zakat-fitrah.png'),
      screen: 'Payment'
    },
    { 
      id: 'zakatMal', 
      title: 'Zakat Māl', 
      icon: require('../assets/icons/zakat-mal.png'),
      screen: 'ZakatMal'
    },
    { 
      id: 'zakatPenghasilan', 
      title: 'Zakat Penghasilan', 
      icon: require('../assets/icons/zakat-penghasilan.png'),
      screen: 'ZakatPenghasilan'
    },
    { 
      id: 'reports', 
      title: 'Laporan', 
      icon: require('../assets/icons/Laporan.png'),
      screen: 'Reports'
    },
    { 
      id: 'recipients', 
      title: 'Penerima Zakat', 
      icon: require('../assets/icons/PenerimaZakat.png'),
      screen: 'Recipients'
    },
    { 
      id: 'niatZakat', 
      title: 'Niat & Ijab Kabul', 
      icon: require('../assets/icons/SejarahDalil.png'),
      screen: 'NiatZakat'
    },
    { 
      id: 'kurban', 
      title: 'Kurban', 
      icon: require('../assets/icons/kurban.png'),
      screen: 'Kurban'
    },
    { 
      id: 'settings', 
      title: 'Pengaturan', 
      icon: require('../assets/icons/Pengaturan.png'),
      screen: 'Settings'
    },
  ];

  if (!settings) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Memuat aplikasi...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#16a34a" barStyle="light-content" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../../public/LogoZakat.png')} 
            style={styles.logo} 
          />
          <Text style={styles.title}>SiZakat</Text>
        </View>
        
        <View style={styles.clockContainer}>
          <Text style={styles.clockText}>{currentTime}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Image 
            source={require('../assets/icons/Keluar.png')} 
            style={styles.logoutIcon} 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}
          </Text>
          <Text style={styles.mosqueText}>{settings.mosqueName}</Text>
          <Text style={styles.addressText}>{settings.address}</Text>
        </View>
        
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.menuIconContainer}>
                <Image source={item.icon} style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>SiZakat</Text>
          <Text style={styles.versionText}>Versi 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  clockContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clockText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    padding: 8,
  },
  logoutIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  dateContainer: {
    padding: 16,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  mosqueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  menuItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 24,
  },
  menuIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#16a34a',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 4,
  },
  menuIcon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  menuText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#16a34a',
  },
  versionText: {
    fontSize: 12,
    color: '#16a34a',
    marginTop: 4,
  },
});

export default HomeScreen;